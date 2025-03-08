import React from "react";
import { Text } from "@mantine/core";
import { useVideoContext } from "@/pages/routes/Home/Video/context";
import { formatTime } from "../TimescaleSlider/hooks/useTimescaleSliderMarks.ts";

const Time: React.FC = () => {
  const { state } = useVideoContext();
  const { currentTime, duration } = state;

  return (
    <Text ta="center" size="md" c="gray">
      {formatTime(currentTime)} / {formatTime(duration)}
    </Text>
  );
};

export default Time;
