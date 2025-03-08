import React from "react";

export interface VideoState {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  muted: boolean;
}

export const defaultVideoState: VideoState = {
  videoRef: React.createRef<HTMLVideoElement>(),
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  muted: true,
};
