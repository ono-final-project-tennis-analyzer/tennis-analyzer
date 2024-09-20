import {Modal} from "@mantine/core";
import {useState} from "react";

export const VideoUploadModal = () => {
    const [opened, setOpened] = useState(true);
    return (
        <Modal onClose={() => {
            setOpened(false);
        }} closeButtonProps={{hidden: true}} opened={opened}>
            You video uploaded successfully!
        </Modal>
    )
}