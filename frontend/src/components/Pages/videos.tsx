import { Outlet } from "react-router-dom";
import { DropzoneComponent } from "../Dashboard/Dropzone/DropzoneComponent.tsx";
import { VideoTable } from "../videos/VideoTable.tsx";
import { useGetVideosQuery } from "../../services/videos.service.ts";
export const Videos = () => {
  const getVideos = useGetVideosQuery();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
      }}
    >
      <DropzoneComponent />
      <VideoTable
        data={[
          ...(getVideos.data?.data.videos.map((video) => ({
            id: video.id,
            name: video.name,
            date: video.upload_date,
            status: String(video.status),
          })) || []),
        ]}
      />
      <Outlet />
    </div>
  );
};
