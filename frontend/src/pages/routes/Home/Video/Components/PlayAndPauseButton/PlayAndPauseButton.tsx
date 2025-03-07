import { Button, Card } from "@mantine/core";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";

type PlayAndPauseButtonProps = {
  isPlaying: boolean;
  onPlayPause?: () => void;
}

export default function PlayAndPauseButton({ isPlaying, onPlayPause }: PlayAndPauseButtonProps) {
  return <Card style={{
    width: "100%",
    height: "100%",
    display: "flex",
    backgroundColor: "pink",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: '0px',
  }}><Button variant="text" onClick={onPlayPause}>{isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}</Button></Card>    ;
}

