import React, { useRef, useEffect } from "react";
import { Card } from "@mantine/core";
import styles from "./VideoPlayer.module.css";
import { useVideoContext } from "../../context";

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    videoURL,
    autoPlay,
    setVideoRef,
    state: { muted },
  } = useVideoContext();

  useEffect(() => {
    setVideoRef(videoRef);
  }, [setVideoRef]);

  return (
    <Card className={styles.card} shadow="sm">
      <video
        ref={videoRef}
        src={videoURL}
        autoPlay={autoPlay}
        className={styles.video}
        muted={muted}
      />
    </Card>
  );
};

export default VideoPlayer;
