import React from "react";
import { Group, Stack } from "@mantine/core";
import TimescaleSlider from "./components/TimescaleSlider";
import VideoControls from "./components/VideoControls";
import Time from "./components/Time";

const VideoTopControls: React.FC = () => {
  return (
    <Group align="center" p="md" w="100%">
      <Stack p={0} flex={1}>
        <TimescaleSlider />
      </Stack>
      <Stack p={0}>
        <VideoControls />
      </Stack>
      <Stack p={0} align="flex-end" w={100}>
        <Time />
      </Stack>
    </Group>
  );
};

export default VideoTopControls;
