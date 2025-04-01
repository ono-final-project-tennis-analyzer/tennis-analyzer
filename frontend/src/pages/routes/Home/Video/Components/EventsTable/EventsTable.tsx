import { Badge, Card } from "@mantine/core";
import {
  EVideoEventType,
  getVideoEventTypeText,
  VideoEvent,
} from "@/@types/VideoEvent";
import Styles from "./EventsTable.module.css"

import Table, {
  TableColumn,
} from "@/components/Table";

type EventsTableProps = {
  events: VideoEvent[];
  onSetStrokeType: (event: VideoEvent) => void;
};

export default function EventsTable({
  events,
  onSetStrokeType,
}: EventsTableProps) {
  const columns: TableColumn<VideoEvent>[] = [
    {
      header: "#id",
      renderRow: (cell) => cell.data.id,
      accessor: "id",
      minWidth: 30,
    },
    {
      header: "Event Type",
      renderRow: (cell) => (
        <Badge color="blue">
          {getVideoEventTypeText(cell.data.event_type as EVideoEventType)}
        </Badge>
      ),
      accessor: "event_type",
      minWidth: 30,
    },
    {
      header: "Stroke Type",
      renderRow: (cell) => (
        <Badge color="blue">
          {cell.data.stroke_type ?? 'N / A'}
        </Badge>
      ),
      accessor: "event_type",
      minWidth: 30,
    },
    {
      header: "Time",
      renderRow: (cell) => cell.data.time_string,
      accessor: "time_string",
      minWidth: 30,
    },
    {
      header: "Frame",
      renderRow: (cell) => cell.data.frame_number,
      accessor: "frame_number",
      minWidth: 30,
    },
  ];

  return (
    <Card className={Styles.card}>
      <Table<VideoEvent>
        data={events}
        columns={columns}
        pageSize={5}
        searchable={false}
        noResultsText="No events found."
        height="calc(100vh - 750px)"
      />
    </Card>
  );
}
