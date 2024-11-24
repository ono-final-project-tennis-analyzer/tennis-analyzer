import React from "react";
import { Progress, Text } from "@mantine/core";

interface Props {
  progress: number;
  stage: string;
}

const stageColorMap: Record<string, string> = {
  downloading: "lightgreen",
  detecting_court: "limegreen",
  tracking_ball: "green",
  processing_frames: "forestgreen",
  uploading: "darkgreen",
  error: "red",
};

const VideoProgressCell: React.FC<Props> = ({ progress, stage }) => {
  if (progress === 100) {
    return <Text>Completed!</Text>;
  }

  const getColor = () => stageColorMap[stage] || "yellow";
  const progressText = progress > 0 ? `${progress}%` : "starting...";

  return (
    <Progress.Root size="xl" data-progress={progress} >
      <Progress.Section value={progress} color={getColor()} animated>
        <Progress.Label>{progressText}</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
};

export default VideoProgressCell;
