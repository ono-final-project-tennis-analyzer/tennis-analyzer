import { Badge, Button, Card, Flex } from "@mantine/core";
import { EStrokeType, EVideoEventType, getStrokeTypeText, getVideoEventTypeText, VideoEvent } from "@/@types/VideoEvent";

import Table, {
    // RowActionItem,
    // RowActions,
    // TableCell,
    TableColumn,
  } from "@/components/Table";

  type EventsTableProps = {
    events: VideoEvent[];
    onSetStrokeType: (event: VideoEvent) => void;
  }

export default function EventsTable({events, onSetStrokeType}: EventsTableProps) {

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
                <>
                  {Object.values(EStrokeType).includes(cell.data.event_type as EStrokeType) ? (
                    getStrokeTypeText(cell.data.event_type as EStrokeType) //Already has a stroke type
                  ) : Object.values(EVideoEventType).includes(cell.data.event_type as EVideoEventType) && //not a stroke type yet but is a video event type
                     cell.data.event_type as EVideoEventType != EVideoEventType.BallBounce //not a ball bounce so its a stroke type
                       ? (
                    <Flex gap="xs">
                      <Badge color="blue">{getVideoEventTypeText(cell.data.event_type as EVideoEventType)}</Badge>
                      <Button variant="light" color="blue" size="xs" onClick={() => {
                        onSetStrokeType(cell.data);
                      }}>Set Stroke Type</Button>
                    </Flex>
                  ) : ( //its a ball bounce or a player stroke so its a video event type
                    <Badge color="blue">{getVideoEventTypeText(cell.data.event_type as EVideoEventType)}</Badge>
                  )}
                </>
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
        <Card style={{ width: "100%", height: "100%", borderRadius: "10px",backgroundColor:"#f0f0f0" }}>

            <Table<VideoEvent>
            data={events}
            columns={columns}
            pageSize={10}
            searchable={true}
            noResultsText="No events found." />
        </Card>
    )
}   
