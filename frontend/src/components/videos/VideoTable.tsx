import {Button, ButtonGroup, Space, Table} from "@mantine/core";

export type videoRow = {
    id: string,
    name: string,
    date: string,
    status: string
}

type VideoTableProps = {
    data: videoRow[]
}

export const VideoTable = ({data}:VideoTableProps) => {

    const headers= ["Name", "Date", "Status", "Actions"];

    const rows = data.map((row) =>(
        <Table.Tr key={row.id}>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.date}</Table.Td>
            <Table.Td>{row.status}</Table.Td>
            <Table.Td style={{display:"flex", width:"100%", gap:4}}>
                    <Button>View</Button>
                    <Button color={"yellow"}>Edit</Button>
                    <Button color={"red"}>Delete</Button>
            </Table.Td>

        </Table.Tr>
    ) );

    return (
        <Table
        >
                <Table.Thead>
                    <Table.Tr>
                        {headers.map((header) => (
                            <Table.Th key={header}>{header}</Table.Th>
                        ))}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                </Table.Tbody>
        </Table>
    );
}