import React from "react";
import TennisPlaygroundMap from "./components/TennisPlaygroundMap";
import { useVideoContext } from "../../../Video/context";
import styles from "./PlayGround.module.css";
import { PlayGroundProps } from "./PlayGround.types.ts";
import { usePlaygroundPoints } from "./hooks/usePlaygroundPoints.ts";
import TennisPlaygroundLegend from "./components/TennisPlaygroundLegend";

const PlayGround: React.FC<PlayGroundProps> = ({ events = [] }) => {
  const {
    state: { currentTime },
  } = useVideoContext();
  const points = usePlaygroundPoints(events, currentTime);

  console.log("points", points);

  // Calculate a dynamic scale based on the parent element of the map
  const mapContainer = document.getElementById("tennis-playground-map");
  const parentElement = mapContainer?.parentElement;
  const width = parentElement?.clientWidth ?? 0;
  const height = parentElement?.clientHeight ?? 0;
  const scale = Math.min(width / 150 || 3, height / 300 || 3) ?? 1;

  return (
    <div className={styles.container}>
      <TennisPlaygroundMap
        scale={scale}
        playerScale={1}
        ballScale={0.5}
        points={points}
      />
      <TennisPlaygroundLegend />
    </div>
  );
};

export default PlayGround;
