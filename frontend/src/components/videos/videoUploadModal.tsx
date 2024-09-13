import {Modal, Progress} from "@mantine/core";

export const VideoUploadModal = () => {
    return (
        <Modal onClose={() => {
        }} closeButtonProps={{hidden: true}} opened={true}>
            Your video progress...
            <Progress animated value={10}/>
        </Modal>
    )
}