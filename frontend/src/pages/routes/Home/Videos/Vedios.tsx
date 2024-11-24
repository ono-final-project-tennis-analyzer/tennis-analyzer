import { Outlet } from "react-router-dom";
import { useGetVideosQuery } from "@/services/videos.service.ts";
import React from "react";
import VideoTable from "./components/VideoTable";
import { Stack } from "@mantine/core";

const Videos = () => {
  const { data } = useGetVideosQuery();

  return (
    <Stack justify="center">
      <VideoTable data={data ? data.videos : []} />
      <Outlet />
    </Stack>
  );
};

export default Videos;
