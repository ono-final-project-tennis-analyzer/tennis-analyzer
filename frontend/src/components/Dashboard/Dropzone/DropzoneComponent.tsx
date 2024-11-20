import {IconUpload, IconVideo, IconX} from "@tabler/icons-react";
import {Dropzone} from '@mantine/dropzone';
import {Group, Text, rem, Button} from "@mantine/core";
import {useState} from "react";
import {useUploadFileMutation} from "../../../services/file.service.ts";
import {useNavigate} from "react-router-dom";
import {DropzoneLoadingModal} from "./DropzoneLoadingModal.tsx";

type DropzoneComponentProps = {
    showOnlyDragAndDrop?: boolean;
}

export const DropzoneComponent = ({
                                      // showOnlyDragAndDrop=false
}:DropzoneComponentProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const uploadFile = useUploadFileMutation((data) => {
        setTimeout(() => {
            setOpenModal(false);
            navigate(`/videos/videoUpload/${data.event_id}`);
        }, 5000);
    });
    return (
        <>
        {/*{showOnlyDragAndDrop && <Button onClick={} >Upload video</Button>}*/}
        <Dropzone
            maxFiles={1}
            onDrop={(files) => {
                setFile(files[0]);
                uploadFile.mutate(files[0]);
                setOpenModal(true);
            }}
            accept={['video/*']}
            maxSize={100 * 1024 ** 3}

        >
            <Group justify="center" gap="xl" mih={220} style={{pointerEvents: 'none'}}>
                <Dropzone.Accept>
                    <IconUpload
                        style={{width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)'}}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)'}}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconVideo
                        style={{width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)'}}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Drag video here or click to select video file
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Attach your tennis video, file should not exceed 100mb
                    </Text>
                </div>
            </Group>

            <DropzoneLoadingModal opened={openModal}/>
        </Dropzone>
        </>
    )
}