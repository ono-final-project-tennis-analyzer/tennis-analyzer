import React from "react";
import { Card, Button, Group, rem, Stack, ActionIcon } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerStop,
  IconVolumeOff,
  IconVolume,
} from "@tabler/icons-react";
import { useVideoContext } from "../../../../context";

const VideoControls: React.FC = () => {
  const { state, playVideo, pauseVideo, restartVideo, toggleMute } =
    useVideoContext();
  const { isPlaying, muted } = state;

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseVideo();
    } else {
      await playVideo();
    }
  };

  const handleReset = async () => {
    await restartVideo();
  };

  return (
    <Stack p={0}>
      <Group p="xs" gap="xs">
        <ActionIcon
          onClick={handlePlayPause}
          color={isPlaying ? "red" : "green"}
        >
          {isPlaying ? (
            <IconPlayerPause style={{ height: rem(20), width: rem(20) }} />
          ) : (
            <IconPlayerPlay style={{ height: rem(20), width: rem(20) }} />
          )}
        </ActionIcon>
        <ActionIcon onClick={handleReset} color="orange">
          <IconPlayerStop style={{ height: rem(20), width: rem(20) }} />
        </ActionIcon>
        <ActionIcon onClick={toggleMute} color={muted ? "gray" : "blue"}>
          {muted ? (
            <IconVolumeOff style={{ width: rem(24), height: rem(24) }} />
          ) : (
            <IconVolume style={{ width: rem(24), height: rem(24) }} />
          )}
        </ActionIcon>
      </Group>
    </Stack>
  );
};

export default VideoControls;
