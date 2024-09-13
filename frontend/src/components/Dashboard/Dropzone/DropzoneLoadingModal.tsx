import {Modal, Progress} from "@mantine/core";
import {useEffect, useRef} from "react";

type DropzoneLoadingModalProps = {
    opened: boolean;

}
export const DropzoneLoadingModal = ({opened}: DropzoneLoadingModalProps) => {
    const timer = useRef(0);
    const progressSpeed = Math.floor(Math.random() * 20) + 5

    useEffect(() => {
        if (opened) {
            timer.current = window.setInterval(() => {
                progress += progressSpeed
            }, 1000);
        }
        return () => {
            window.clearInterval(timer.current);
        }
    }, [opened]);

    let progress = 0;

    return (<Modal opened={opened} onClose={() => {

    }}>
        <Progress animated value={progress}/>
    </Modal>)
}