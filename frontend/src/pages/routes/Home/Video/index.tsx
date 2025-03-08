import VideoRoot from "./Video";
import { VideoProvider } from "@/pages/routes/Home/Video/context";
import React from "react";
import { VideoProviderProps } from "@/pages/routes/Home/Video/context/Video.Provider.tsx";

type Props = Omit<VideoProviderProps, "children">;

const Video: React.FC<Props> = (props) => (
  <VideoProvider {...props}>
    <VideoRoot />
  </VideoProvider>
);

export default Video;
