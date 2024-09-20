import {Modal, Progress} from "@mantine/core";

export const VideoUploadModal = () => {

    return (
        <Modal onClose={() => {
        }} closeButtonProps={{hidden: true}} opened={true}>
            You video uploaded successfully!
            {/*<Progress animated value={10}/>*/}
        </Modal>
    )
}