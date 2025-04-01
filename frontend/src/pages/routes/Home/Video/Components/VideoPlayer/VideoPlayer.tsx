import React, { useRef, useEffect } from "react";
import { Card } from "@mantine/core";
import styles from "./VideoPlayer.module.css";
import { useVideoContext } from "../../context";

const VideoPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    autoPlay,
    setVideoRef,
    playVideo,
    pauseVideo,
    state: { muted, isPlaying },
  } = useVideoContext();

  useEffect(() => {
    setVideoRef(videoRef);
  }, [setVideoRef]);

  return (
    <Card className={styles.card} shadow="sm">
      <video
        ref={videoRef}
        src={`http://localhost:8081/videos/stream/${videoId}`}
        autoPlay={autoPlay}
        className={styles.video}
        muted={muted}
        onClick={isPlaying ? pauseVideo : playVideo}
      />
    </Card>
  );
};

export default VideoPlayer;
