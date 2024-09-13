import {Button, FileButton, Group, Text} from "@mantine/core";

import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useUploadFileMutation} from "../../services/file.service.ts";

export const Videos = () => {
    const timer = useRef(0);
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const resetRef = useRef<() => void>(null);
    const uploadFile = useUploadFileMutation((data) => {
        navigate(`/videos/videoUpload/${data.event_id}`);
    });

    const uploadVideo = () => {
        uploadFile.mutate(file as File);
    }
    const clearFile = () => {
        setFile(null);
        resetRef.current?.();
    };

    useEffect(() => {
        timer.current = window.setInterval(() => {
            console.log("Timer is running");
        }, 1000);

        return () => {
            window.clearInterval(timer.current);
        }
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",

        }}>
            <Group justify="center">
                <FileButton resetRef={resetRef} onChange={setFile} accept="video/avi,video/mp4">
                    {(props) => <Button {...props}>Upload Video</Button>}
                </FileButton>
                <Button disabled={!file} color="red" onClick={clearFile}>
                    Reset
                </Button>
                <Button color={"green"} disabled={!file} onClick={uploadVideo}>
                    Upload
                </Button>
            </Group>
            {file && (
                <Text size="sm" ta="center" mt="sm">
                    Picked file: {file.name}
                </Text>
            )}

            <Outlet/>
        </div>
    )
}