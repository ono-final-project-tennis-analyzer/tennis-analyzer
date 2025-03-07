import { useEffect, useRef } from "react";



export enum TennisPlaygroundMapPointType {
  BALL = "ball",
  PLAYER = "player",
  PLAYER_IMPACT = "player_impact",
  GROUND_IMPACT = "ground_impact",
}


type TennisPlaygroundMapProps = {
  points?: {id:string,type:TennisPlaygroundMapPointType, x: number; y: number }[];
  scale?: number;
  playerScale?: number;
  ballScale?: number;
};

export const TennisPlaygroundMap = ({
  points = [],
  scale = 3,
  playerScale = 3, // Scale for drawing players and balls
  ballScale = 1, // Scale for drawing players and balls
}: TennisPlaygroundMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef(new Map()); // Store previous positions


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size - vertical court
    canvas.width = 150 * scale;
    canvas.height = 300 * scale ;

    // Set line style
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    // Draw main court outline
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Draw horizontal center line
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();

    // Draw service court lines
    const serviceLineLeft = canvas.width * 0.15; // Left vertical line
    const serviceLineRight = canvas.width * 0.85; // Right vertical line
    const serviceLineTop = canvas.height * 0.27; // Top service line
    const serviceLineBottom = canvas.height * 0.73; // Bottom service line

    ctx.beginPath();
    // Left service line
    ctx.moveTo(serviceLineLeft, 10);
    ctx.lineTo(serviceLineLeft, canvas.height - 10);
    // Right service line
    ctx.moveTo(serviceLineRight, 10);
    ctx.lineTo(serviceLineRight, canvas.height - 10);

    // Center vertical line (only between T-junctions)
    ctx.moveTo(canvas.width / 2, serviceLineTop);
    ctx.lineTo(canvas.width / 2, serviceLineBottom);

    // Top T-junction
    ctx.moveTo(serviceLineLeft, serviceLineTop);
    ctx.lineTo(serviceLineRight, serviceLineTop);
    // Bottom T-junction
    ctx.moveTo(serviceLineLeft, serviceLineBottom);
    ctx.lineTo(serviceLineRight, serviceLineBottom);
    ctx.stroke();

    // Plot points with animation
    points.forEach((point) => {
      const x = ((point.x + 1) / 2) * canvas.width;
      const y = ((point.y + 1) / 2) * canvas.height;

      // Get previous position if exists
      const prevPos = pointsRef.current.get(point.id);
      const startX = prevPos ? ((prevPos.x + 1) / 2) * canvas.width : x;
      const startY = prevPos ? ((prevPos.y + 1) / 2) * canvas.height : y;

      // Store current position for next render
      pointsRef.current.set(point.id, { x: point.x, y: point.y });

      ctx.beginPath();
      if (point.type === TennisPlaygroundMapPointType.PLAYER) {
        // Draw player as a red square
        const size = 8 * playerScale; // square size
        ctx.fillStyle = "red";
        ctx.fillRect(x - size/2, y - size/2, size, size);
      } else if (point.type === TennisPlaygroundMapPointType.PLAYER_IMPACT) {
        // Draw player impact as an orange diamond
        const size = 8 * playerScale;
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.moveTo(x, y - size/2); // Top point
        ctx.lineTo(x + size/2, y); // Right point
        ctx.lineTo(x, y + size/2); // Bottom point
        ctx.lineTo(x - size/2, y); // Left point
        ctx.closePath();
        ctx.fill();
      } else if (point.type === TennisPlaygroundMapPointType.GROUND_IMPACT) {
        // Draw ground impact as a white X
        const size = 6 * ballScale;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - size/2, y - size/2);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.moveTo(x + size/2, y - size/2);
        ctx.lineTo(x - size/2, y + size/2);
        ctx.stroke();
      } else {
        // Draw ball as a yellow circle
        ctx.arc(x, y, 4 * ballScale, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
      }
    });

    // Clean up old points that are no longer present
    const currentIds = new Set(points.map(p => p.id));
    Array.from(pointsRef.current.keys()).forEach(id => {
      if (!currentIds.has(id)) {
        pointsRef.current.delete(id);
      }
    });
  }, [points, scale]);

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