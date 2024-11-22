import {Table} from "@mantine/core";

export const VideoTable = (data:any) => {

    const headers= ["Name", "Date", "Status"];

    return (
        <Table
            data={data}
        >
                <Table.Thead>
                    <Table.Tr>
                        {headers.map((header) => (
                            <Table.Th key={header}>{header}</Table.Th>
                        ))}
                    </Table.Tr>
                </Table.Thead>
        </Table>
    );
}