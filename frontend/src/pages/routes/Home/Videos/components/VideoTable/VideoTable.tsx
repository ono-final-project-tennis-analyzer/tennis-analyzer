import React from "react";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import { Video } from "@/@types/video.ts";
import Table, {
  RowActionItem,
  RowActions,
  TableCell,
  TableColumn,
} from "@/components/Table";
import VideoProgressCell from "./components/VideoProgressCell.tsx";
import VideoTableActions from "./components/VideoTableActions";
import { useDeleteVideoMutation } from "@/services/videos.service.ts";
import Api from "@/services/api.ts";

const columns: TableColumn<Video>[] = [
  {
    header: "#id",
    renderRow: (cell) => cell.data.id,
    accessor: "id",
    minWidth: 30,
  },
  {
    header: "File Name",
    renderRow: (cell) => cell.data.name,
    accessor: "file_name",
    minWidth: 100,
  },
  {
    header: "Stage",
    renderRow: (cell) => cell.data.event_data.stage,
    accessor: "status",
    minWidth: 100,
  },
  {
    header: "Upload Date",
    renderRow: (cell) => cell.data.upload_date,
    accessor: "upload_date",
    minWidth: 150,
  },
  {
    header: "Progress",
    renderRow: (cell) => (
      <VideoProgressCell
        progress={cell.data.event_data.progress}
        stage={cell.data.event_data.stage}
      />
    ),
    accessor: "progress",
    minWidth: 200,
  },
];

const VideoTable: React.FC<{ data: Video[] }> = ({ data }) => {
  const { mutate: deleteVideo } = useDeleteVideoMutation();

  const createActionItems = (
    cell: TableCell<Video>,
  ): RowActionItem<Video>[] => [
    {
      label: "Download Processed Video",
      icon: <IconDownload style={{ width: rem(14), height: rem(14) }} />,
      onClick: () => {
        const downloadUrl = `${Api.BASE_URL}/videos/download/processed/${cell.data.id}?download=true`;
        window.open(downloadUrl, "_blank");
      },
    },
    {
      label: "Download Original Video",
      icon: <IconDownload style={{ width: rem(14), height: rem(14) }} />,
      onClick: () => {
        const downloadUrl = `${Api.BASE_URL}/videos/download/original/${cell.data.id}?download=true`;
        window.open(downloadUrl, "_blank");
      },
    },
    {
      label: "Delete",
      icon: <IconTrash style={{ width: rem(14), height: rem(14) }} />,
      onClick: (cell) => deleteVideo(Number(cell.data.id)),
      danger: true,
    },
  ];

  const actions = (cell: TableCell<Video>) => (
    <RowActions cell={cell} items={createActionItems(cell)} />
  );

  return (
    <Table<Video>
      data={data}
      columns={columns}
      actions={actions}
      pageSize={10}
      searchable={true}
      noResultsText="No videos found."
      rightSection={<VideoTableActions />}
    />
  );
};

export default VideoTable;
