import { useEffect, useRef } from "react";

type TennisPlaygroundMapProps = {
  points?: { x: number; y: number }[];
};

export const TennisPlaygroundMap = ({
  points = [],
}: TennisPlaygroundMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size - vertical court
    canvas.width = 150;
    canvas.height = 300;

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

    // Plot points
    points.forEach((point) => {
      const x = ((point.x + 1) / 2) * canvas.width;
      const y = ((point.y + 1) / 2) * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
    });
  }, [points]);

  return (
    <canvas
      ref={canvasRef}
      id="tennis-playground-map"
      style={{
        background: "#2c5530",
        border: "1px solid #fff",
      }}
    />
  );
};
