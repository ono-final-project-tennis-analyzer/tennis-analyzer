import {Button, FileButton, Group, Text} from "@mantine/core";

import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useUploadFileMutation} from "../../services/file.service.ts";
import {DropzoneComponent} from "../Dashboard/Dropzone/DropzoneComponent.tsx";
import Table, {TableCell, TableColumn} from "../Table";

export const Videos = () => {
    const timer = useRef(0);
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const resetRef = useRef<() => void>(null);
    const uploadFile = useUploadFileMutation((data) => {
        setTimeout(() => {
            navigate(`/videos/videoUpload/${data.event_id}`);
        }, 5000);
    });

    const uploadVideo = () => {
        uploadFile.mutate(file as File);
    }
    const clearFile = () => {
        setFile(null);
        resetRef.current?.();
    };

    type VideoRow = {
        id: string,
        Name: string,
        Date: string,
        Status: string
    }

    const columns: TableColumn<VideoRow>[] = [
        {
            header: "Name",
            renderRow: (cell: TableCell<VideoRow>) => (
                <>{cell}</>
            ),
            accessor: "name",
            minWidth: 120,
        },
        {
            header: "Date",
            renderRow: (cell: TableCell<VideoRow>) => (
                <>{cell}</>
            ),
            accessor: "date",
            minWidth: 120,
        },
        {
            header: "Status",
            renderRow: (cell: TableCell<VideoRow>) => (
                <>{cell}</>
            ),
            accessor: "status",
            minWidth: 120,
        }
    ]

    const data: VideoRow[] = [
        {
            "id": "1",
            "Name": "Video 1",
            "Date": "2021-09-01",
            "Status": "Processed"
        },
        {
            "id": "2",
            "Name": "Video 2",
            "Date": "2021-09-02",
            "Status": "Processing"
        },
        {
            "id": "3",
            "Name": "Video 3",
            "Date": "2021-09-03",
            "Status": "Uploaded"
        }
    ]

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
        }}>
            <DropzoneComponent/>
            {/*<Table data={data} columns={columns}/>*/}
            <Outlet/>
        </div>
    )
}