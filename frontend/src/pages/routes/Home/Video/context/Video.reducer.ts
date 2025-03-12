import { VideoState } from "./Video.state";
import React from "react";

export enum VideoActionTypes {
  SET_REF = "SET_REF",
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  UPDATE_TIME = "UPDATE_TIME",
  SET_DURATION = "SET_DURATION",
  TOGGLE_MUTE = "TOGGLE_MUTE",
  SET_VIDEO_URL = "SET_VIDEO_URL",
}

export type VideoAction =
  | {
      type: VideoActionTypes.SET_REF;
      payload: React.RefObject<HTMLVideoElement>;
    }
  | { type: VideoActionTypes.PLAY }
  | { type: VideoActionTypes.PAUSE }
  | { type: VideoActionTypes.UPDATE_TIME; payload: number }
  | { type: VideoActionTypes.SET_DURATION; payload: number }
  | { type: VideoActionTypes.TOGGLE_MUTE };

export function videoReducer(
  state: VideoState,
  action: VideoAction,
): VideoState {
  switch (action.type) {
    case VideoActionTypes.SET_REF:
      return { ...state, videoRef: action.payload };
    case VideoActionTypes.PLAY:
      return { ...state, isPlaying: true };
    case VideoActionTypes.PAUSE:
      return { ...state, isPlaying: false };
    case VideoActionTypes.UPDATE_TIME:
      return { ...state, currentTime: action.payload };
    case VideoActionTypes.SET_DURATION:
      return { ...state, duration: action.payload };
    case VideoActionTypes.TOGGLE_MUTE:
      return { ...state, muted: !state.muted };
    default:
      return state;
  }
}
