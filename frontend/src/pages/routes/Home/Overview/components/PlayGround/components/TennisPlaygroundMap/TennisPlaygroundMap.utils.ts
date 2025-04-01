import {
  TennisPlaygroundMapPoint,
  TennisPlaygroundMapPointType,
} from "./TennisPlaygroundMap.types";

export class TennisPlaygroundRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private drawnPoints: Set<string> = new Set();
  private ballScale: number;
  private playerScale: number;
  private courtDrawn = false;

  // For ball bounce ordering
  private ballBounceNumbers: Map<string, number> = new Map();
  private ballBounceCounter: number = 0;

  // For stroke markers without coordinates: counters per player
  private topStrokeCounter: number = 0;
  private bottomStrokeCounter: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    ballScale: number,
    playerScale: number,
    scale: number,
  ) {
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

  // Draws the two player squares immediately after the court.
  public drawPlayers(): void {
    const { ctx, canvas, playerScale } = this;
    const topPlayerId = "player_top";
    const bottomPlayerId = "player_bottom";
    if (
      this.drawnPoints.has(topPlayerId) &&
      this.drawnPoints.has(bottomPlayerId)
    ) {
      return;
    }
    const squareSize = 10 * playerScale;
    // Top player: centered on the top outer line.
    const topX = canvas.width / 2;
    const topY = 10;
    ctx.fillStyle = "blue";
    ctx.fillRect(
      topX - squareSize / 2,
      topY - squareSize / 2,
      squareSize,
      squareSize,
    );

    // Bottom player: centered on the bottom outer line.
    const bottomX = canvas.width / 2;
    const bottomY = canvas.height - 10;
    ctx.fillStyle = "red";
    ctx.fillRect(
      bottomX - squareSize / 2,
      bottomY - squareSize / 2,
      squareSize,
      squareSize,
    );

    this.drawnPoints.add(topPlayerId);
    this.drawnPoints.add(bottomPlayerId);
  }

  // Converts normalized (x,y) to canvas coordinates.
  private getCanvasCoordinates(
    x: number,
    y: number,
  ): { canvasX: number; canvasY: number } {
    const canvasX = ((x + 1) / 2) * this.canvas.width;
    const canvasY = ((1 - y) / 2) * this.canvas.height;
    return { canvasX, canvasY };
  }

  // Public method: add new points.
  // Handles both points with coordinates (e.g. ball bounce events) and stroke events.
  public addPoints(points: TennisPlaygroundMapPoint[]): void {
    points.forEach((point) => {
      if (this.drawnPoints.has(point.id)) return;

      // Stroke event: has strokeType (and no x,y).
      if (point.strokeType) {
        const player =
          point.type === TennisPlaygroundMapPointType.BOTTOM_PLAYER_STROKE
            ? "bottom"
            : "top";
        const markerSize = 10 * this.playerScale;
        const gap = 5;
        let posX: number, posY: number;
        // For top strokes, place them in a row just below the top player's square.
        if (player === "top") {
          posX = 20 + this.topStrokeCounter * (markerSize + gap);
          posY = 30;
          this.topStrokeCounter++;
        } else {
          posX = 20 + this.bottomStrokeCounter * (markerSize + gap);
          posY = this.canvas.height - 30;
          this.bottomStrokeCounter++;
        }
        this.drawStrokeMarker(point.strokeType, posX, posY, markerSize, player);
        this.drawnPoints.add(point.id);
      }
      // Otherwise, if the point has x,y coordinates (e.g. ball bounces)
      else if (point.x !== undefined && point.y !== undefined) {
        if (point.type === TennisPlaygroundMapPointType.BALL_BOUNCE) {
          if (!this.ballBounceNumbers.has(point.id)) {
            this.ballBounceNumbers.set(point.id, ++this.ballBounceCounter);
          }
          const bounceNumber = this.ballBounceNumbers.get(point.id)!;
          const { canvasX, canvasY } = this.getCanvasCoordinates(
            point.x,
            point.y,
          );
          this.drawBallBounce(canvasX, canvasY, bounceNumber);
          this.drawnPoints.add(point.id);
        }
        // Additional x,y-based events could be handled here.
      }
    });
  }

  // Delegates drawing of a stroke marker based on stroke type.
  private drawStrokeMarker(
    strokeType: string,
    x: number,
    y: number,
    size: number,
    player: "top" | "bottom",
  ): void {
    switch (strokeType.toLowerCase()) {
      case "forehand":
        this.drawForehand(x, y, size);
        break;
      case "backhand":
        this.drawBackhand(x, y, size);
        break;
      case "volley":
        this.drawVolley(x, y, size);
        break;
      case "smash":
        this.drawSmash(x, y, size);
        break;
      case "slice":
        this.drawSlice(x, y, size);
        break;
      default:
        this.ctx.fillStyle = "gray";
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        break;
    }
  }

  // Drawing methods for stroke shapes.
  private drawForehand(x: number, y: number, size: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.closePath();
    ctx.fill();
  }

  private drawBackhand(x: number, y: number, size: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = "orange";
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }

  private drawVolley(x: number, y: number, size: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawSmash(x: number, y: number, size: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = "red";
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
      const x1 = x + Math.cos(rot) * outerRadius;
      const y1 = y + Math.sin(rot) * outerRadius;
      ctx.lineTo(x1, y1);
      rot += step;
      const x2 = x + Math.cos(rot) * innerRadius;
      const y2 = y + Math.sin(rot) * innerRadius;
      ctx.lineTo(x2, y2);
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
  }

  private drawSlice(x: number, y: number, size: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = "teal";
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y);
    ctx.lineTo(x, y + size / 2);
    ctx.lineTo(x - size / 2, y);
    ctx.closePath();
    ctx.fill();
  }

  // Draws a ball bounce point with a numeric label.
  private drawBallBounce(x: number, y: number, label: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, 3 * this.ballScale, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 5 * this.ballScale, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
    ctx.stroke();

    ctx.font = `${10 * this.ballScale}px sans-serif`;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(label.toString(), x, y - 5 * this.ballScale);
  }
}
