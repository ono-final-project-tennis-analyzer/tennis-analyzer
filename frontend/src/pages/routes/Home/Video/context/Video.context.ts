import React, { createContext } from "react";
import { VideoState } from "./Video.state";
import { VideoAction } from "./Video.reducer";

export interface VideoContextType {
  state: VideoState;
  dispatch: React.Dispatch<VideoAction>;
  videoURL: string;
  autoPlay: boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export default VideoContext;
