import React, { useEffect, useRef } from "react";
import { TennisPlaygroundMapProps } from "./TennisPlaygroundMap.types";
import styles from "./TennisPlaygroundMap.module.css";
import { TennisPlaygroundRenderer } from "@/pages/routes/Home/Overview/components/PlayGround/components/TennisPlaygroundMap/TennisPlaygroundMap.utils.ts";

const TennisPlaygroundMap: React.FC<TennisPlaygroundMapProps> = ({
  points = [],
  scale = 3,
  playerScale = 1,
  ballScale = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<TennisPlaygroundRenderer | null>(null);

  // Initialize renderer and draw the court once.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    rendererRef.current = new TennisPlaygroundRenderer(
      canvas,
      ballScale,
      playerScale,
      scale,
    );
    rendererRef.current.drawCourt();
    rendererRef.current.drawPlayers();
  }, [scale, ballScale, playerScale]);

  // Add new points without redrawing the court or players.
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.addPoints(points);
    }
  }, [points]);

  return (
    <canvas
      ref={canvasRef}
      id="tennis-playground-map"
      className={styles.canvas}
    />
  );
};

export default TennisPlaygroundMap;
