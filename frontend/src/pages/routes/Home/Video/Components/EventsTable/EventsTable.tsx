
import { Card } from "@mantine/core";
import { VideoEvent } from "@/@types/VideoEvent";

import Table, {
    // RowActionItem,
    // RowActions,
    // TableCell,
    TableColumn,
  } from "@/components/Table";
export default function EventsTable() {

    const columns: TableColumn<VideoEvent>[] = [
        {
          header: "#id",
          renderRow: (cell) => cell.data.id,
          accessor: "id",
          minWidth: 30,
        },
      ];


    return (
        <Card style={{ width: "100%", height: "100%", borderRadius: "10px",backgroundColor:"#f0f0f0" }}>

            <Table<VideoEvent>
            data={[]}
            columns={columns}
            pageSize={10}
            searchable={true}
            noResultsText="No events found." />
        </Card>
    )
}   
