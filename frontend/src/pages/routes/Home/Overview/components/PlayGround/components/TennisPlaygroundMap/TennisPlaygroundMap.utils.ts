import { TennisPlaygroundMapPoint, TennisPlaygroundMapPointType } from "./TennisPlaygroundMap.types";

export class TennisPlaygroundRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private drawnPoints: Set<string> = new Set();
  private ballScale: number;
  private playerScale: number;
  private courtDrawn = false;

  // To track ball bounce order
  private ballBounceNumbers: Map<string, number> = new Map();
  private ballBounceCounter: number = 0;

  constructor(canvas: HTMLCanvasElement, ballScale: number, playerScale: number, scale: number) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context not available");
    }
    this.ctx = ctx;
    this.ballScale = ballScale;
    this.playerScale = playerScale;
    // Set canvas dimensions based on scale.
    this.canvas.width = 150 * scale;
    this.canvas.height = 300 * scale;
  }

  // Draws the static court once.
  public drawCourt(): void {
    if (this.courtDrawn) return;

    const { ctx, canvas } = this;
    const width = canvas.width;
    const height = canvas.height;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    // Draw court outline.
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Draw center line.
    ctx.beginPath();
    ctx.moveTo(10, height / 2);
    ctx.lineTo(width - 10, height / 2);
    ctx.stroke();

    // Draw service lines.
    const serviceLineLeft = width * 0.15;
    const serviceLineRight = width * 0.85;
    const serviceLineTop = height * 0.27;
    const serviceLineBottom = height * 0.73;

    ctx.beginPath();
    ctx.moveTo(serviceLineLeft, 10);
    ctx.lineTo(serviceLineLeft, height - 10);
    ctx.moveTo(serviceLineRight, 10);
    ctx.lineTo(serviceLineRight, height - 10);
    ctx.moveTo(width / 2, serviceLineTop);
    ctx.lineTo(width / 2, serviceLineBottom);
    ctx.moveTo(serviceLineLeft, serviceLineTop);
    ctx.lineTo(serviceLineRight, serviceLineTop);
    ctx.moveTo(serviceLineLeft, serviceLineBottom);
    ctx.lineTo(serviceLineRight, serviceLineBottom);
    ctx.stroke();

    this.courtDrawn = true;
  }

  // Draws the two player squares right after drawing the court.
  public drawPlayers(): void {
    const { ctx, canvas, playerScale } = this;
    const topPlayerId = "player_top";
    const bottomPlayerId = "player_bottom";
    if (this.drawnPoints.has(topPlayerId) && this.drawnPoints.has(bottomPlayerId)) {
      return;
    }
    // Square size determined by playerScale.
    const squareSize = 10 * playerScale;
    // Top player: position is at the center of the top outer line.
    const topX = canvas.width / 2;
    const topY = 10; // top outer line is at y = 10
    ctx.fillStyle = "blue"; // top player's square color
    ctx.fillRect(topX - squareSize / 2, topY - squareSize / 2, squareSize, squareSize);

    // Bottom player: position is at the center of the bottom outer line.
    const bottomX = canvas.width / 2;
    const bottomY = canvas.height - 10; // bottom outer line is at y = height - 10
    ctx.fillStyle = "red"; // bottom player's square color
    ctx.fillRect(bottomX - squareSize / 2, bottomY - squareSize / 2, squareSize, squareSize);

    // Mark players as drawn.
    this.drawnPoints.add(topPlayerId);
    this.drawnPoints.add(bottomPlayerId);
  }

  // Convert normalized coordinates (-1 to 1) into canvas coordinates.
  private getCanvasCoordinates(x: number, y: number): { canvasX: number; canvasY: number } {
    const canvasX = ((x + 1) / 2) * this.canvas.width;
    const canvasY = ((1 - y) / 2) * this.canvas.height;
    return { canvasX, canvasY };
  }

  // Public method: add new points (if not already drawn) without clearing the canvas.
  public addPoints(points: TennisPlaygroundMapPoint[]): void {
    points.forEach(point => {
      if (!this.drawnPoints.has(point.id)) {
        // For ball bounce points, assign an order number.
        if (point.type === TennisPlaygroundMapPointType.BALL_BOUNCE) {
          if (!this.ballBounceNumbers.has(point.id)) {
            this.ballBounceNumbers.set(point.id, ++this.ballBounceCounter);
          }
        }
        const { canvasX, canvasY } = this.getCanvasCoordinates(point.x, point.y);
        this.drawPoint(point.type, canvasX, canvasY, point.id);
        this.drawnPoints.add(point.id);
      }
    });
  }

  // Delegates drawing based on point type.
  private drawPoint(type: TennisPlaygroundMapPointType, canvasX: number, canvasY: number, pointId: string): void {
    switch (type) {
      case TennisPlaygroundMapPointType.BALL_BOUNCE: {
        const bounceNumber = this.ballBounceNumbers.get(pointId)!;
        this.drawBallBounce(canvasX, canvasY, bounceNumber);
        break;
      }
      case TennisPlaygroundMapPointType.TOP_PLAYER_STROKE:
        this.drawTopPlayerStroke(canvasX, canvasY);
        break;
      case TennisPlaygroundMapPointType.BOTTOM_PLAYER_STROKE:
        this.drawBottomPlayerStroke(canvasX, canvasY);
        break;
      default:
        break;
    }
  }

  // Draws a ball bounce point along with its order number.
  private drawBallBounce(x: number, y: number, label: number): void {
    // Draw the ball bounce circle and ripple.
    this.ctx.beginPath();
    this.ctx.arc(x, y, 3 * this.ballScale, 0, Math.PI * 2);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(x, y, 5 * this.ballScale, 0, Math.PI * 2);
    this.ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
    this.ctx.stroke();

    // Draw the number label on top.
    this.ctx.font = `${10 * this.ballScale}px sans-serif`;
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    // Position the text slightly above the circle.
    this.ctx.fillText(label.toString(), x, y - 5 * this.ballScale);
  }

  // Draws a top player stroke point.
  private drawTopPlayerStroke(x: number, y: number): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(0, 0, 255, 0.8)";
    const topSize = 8 * this.playerScale;
    this.ctx.moveTo(x, y - topSize);
    this.ctx.lineTo(x + topSize, y + topSize);
    this.ctx.lineTo(x - topSize, y + topSize);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Draws a bottom player stroke point.
  private drawBottomPlayerStroke(x: number, y: number): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    const bottomSize = 8 * this.playerScale;
    this.ctx.moveTo(x, y + bottomSize);
    this.ctx.lineTo(x + bottomSize, y - bottomSize);
    this.ctx.lineTo(x - bottomSize, y - bottomSize);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
