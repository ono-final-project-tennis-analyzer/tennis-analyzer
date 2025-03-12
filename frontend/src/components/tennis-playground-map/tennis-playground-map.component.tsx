import { useEffect, useRef } from "react";

export enum TennisPlaygroundMapPointType {
  BALL_BOUNCE = "ball_bounce",
  TOP_PLAYER_STROKE = "top_player_stroke",
  BOTTOM_PLAYER_STROKE = "bottom_player_stroke"
}

type TennisPlaygroundMapProps = {
  points?: {id: string, type: TennisPlaygroundMapPointType, x: number; y: number }[];
  scale?: number;
  playerScale?: number;
  ballScale?: number;
};

export const TennisPlaygroundMap = ({
  points = [],
  scale = 3,
  playerScale = 3,
  ballScale = 1,
}: TennisPlaygroundMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const previousPointsRef = useRef(new Map<string, { x: number; y: number }>());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 150 * scale;
    canvas.height = 300 * scale;

    const drawPoint = (point: { id: string, type: TennisPlaygroundMapPointType, x: number, y: number }) => {
      // Convert from normalized coordinates (-1 to 1) to canvas coordinates
      const canvasX = ((point.x + 1) / 2) * canvas.width;
      const canvasY = ((1 - point.y) / 2) * canvas.height; // Adjusted for new coordinate system

      // Get previous position or use current as initial
      let prevPos = previousPointsRef.current.get(point.id);
      if (!prevPos) {
        prevPos = { x: canvasX, y: canvasY };
        previousPointsRef.current.set(point.id, prevPos);
      }

      // Interpolate position with higher factor for more visible movement
      const LERP_FACTOR = 0.3; // Increased from 0.15 for more visible interpolation
      prevPos.x += (canvasX - prevPos.x) * LERP_FACTOR;
      prevPos.y += (canvasY - prevPos.y) * LERP_FACTOR;

      // Draw based on type
      switch (point.type) {
        case TennisPlaygroundMapPointType.BALL_BOUNCE:
          // Ball bounce - yellow dot with ripple
          ctx.beginPath();
          ctx.arc(prevPos.x, prevPos.y, 3 * ballScale, 0, Math.PI * 2);
          ctx.fillStyle = "yellow";
          ctx.fill();
          
          // Ripple effect
          ctx.beginPath();
          ctx.arc(prevPos.x, prevPos.y, 5 * ballScale, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
          ctx.stroke();
          break;

        case TennisPlaygroundMapPointType.TOP_PLAYER_STROKE:
          // Top player stroke - larger blue triangle
          ctx.beginPath();
          ctx.fillStyle = "rgba(0, 0, 255, 0.8)";
          const topSize = 8 * playerScale;
          ctx.moveTo(prevPos.x, prevPos.y - topSize);
          ctx.lineTo(prevPos.x + topSize, prevPos.y + topSize);
          ctx.lineTo(prevPos.x - topSize, prevPos.y + topSize);
          ctx.closePath();
          ctx.fill();
          break;

        case TennisPlaygroundMapPointType.BOTTOM_PLAYER_STROKE:
          // Bottom player stroke - larger red triangle
          ctx.beginPath();
          ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
          const bottomSize = 8 * playerScale;
          ctx.moveTo(prevPos.x, prevPos.y + bottomSize);
          ctx.lineTo(prevPos.x + bottomSize, prevPos.y - bottomSize);
          ctx.lineTo(prevPos.x - bottomSize, prevPos.y - bottomSize);
          ctx.closePath();
          ctx.fill();
          break;
      }
    };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw court
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Center line
      ctx.beginPath();
      ctx.moveTo(10, canvas.height / 2);
      ctx.lineTo(canvas.width - 10, canvas.height / 2);
      ctx.stroke();

      // Service lines
      const serviceLineLeft = canvas.width * 0.15;
      const serviceLineRight = canvas.width * 0.85;
      const serviceLineTop = canvas.height * 0.27;
      const serviceLineBottom = canvas.height * 0.73;

      ctx.beginPath();
      ctx.moveTo(serviceLineLeft, 10);
      ctx.lineTo(serviceLineLeft, canvas.height - 10);
      ctx.moveTo(serviceLineRight, 10);
      ctx.lineTo(serviceLineRight, canvas.height - 10);
      ctx.moveTo(canvas.width / 2, serviceLineTop);
      ctx.lineTo(canvas.width / 2, serviceLineBottom);
      ctx.moveTo(serviceLineLeft, serviceLineTop);
      ctx.lineTo(serviceLineRight, serviceLineTop);
      ctx.moveTo(serviceLineLeft, serviceLineBottom);
      ctx.lineTo(serviceLineRight, serviceLineBottom);
      ctx.stroke();

      // Draw all points
      points.forEach(drawPoint);

      // Clean up old points
      const currentIds = new Set(points.map(p => p.id));
      Array.from(previousPointsRef.current.keys()).forEach(id => {
        if (!currentIds.has(id)) {
          previousPointsRef.current.delete(id);
        }
      });

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [points, scale, playerScale, ballScale]);

  return (
    <canvas
      ref={canvasRef}
      id="tennis-playground-map"
      style={{
        background: "#2c5530",
        border: "1px solid #fff",
        margin: "auto",
      }}
    />
  );
};

// Helper functions
function drawCourt(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;

  // Draw main court outline
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Draw horizontal center line
  ctx.beginPath();
  ctx.moveTo(10, height / 2);
  ctx.lineTo(width - 10, height / 2);
  ctx.stroke();

  // Draw service court lines
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
}

function drawPoint(
  ctx: CanvasRenderingContext2D,
  type: TennisPlaygroundMapPointType,
  x: number,
  y: number,
  ballScale: number,
  playerScale: number
) {
  ctx.beginPath();
  switch (type) {
    case TennisPlaygroundMapPointType.BALL_BOUNCE:
      ctx.arc(x, y, 2 * ballScale, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 0, 0.3)";
      ctx.arc(x, y, 3 * ballScale, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case TennisPlaygroundMapPointType.TOP_PLAYER_STROKE:
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.moveTo(x, y - 6 * playerScale);
      ctx.lineTo(x + 6 * playerScale, y + 6 * playerScale);
      ctx.lineTo(x - 6 * playerScale, y + 6 * playerScale);
      ctx.closePath();
      ctx.fill();
      break;

    case TennisPlaygroundMapPointType.BOTTOM_PLAYER_STROKE:
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(x, y + 6 * playerScale);
      ctx.lineTo(x + 6 * playerScale, y - 6 * playerScale);
      ctx.lineTo(x - 6 * playerScale, y - 6 * playerScale);
      ctx.closePath();
      ctx.fill();
      break;
  }
}