import {Button, FileButton, Group, Text} from "@mantine/core";

import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useUploadFileMutation} from "../../services/file.service.ts";
import {DropzoneComponent} from "../Dashboard/Dropzone/DropzoneComponent.tsx";

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
    

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",

        }}>
            <DropzoneComponent/>
            <Outlet/>
        </div>
    )
}