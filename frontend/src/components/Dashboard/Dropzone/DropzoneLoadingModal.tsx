import {Modal, Progress} from "@mantine/core";
import {useEffect, useRef, useState} from "react";

type DropzoneLoadingModalProps = {
    opened: boolean;
    setOpened: (opened: boolean) => void;
}
export const DropzoneLoadingModal = ({opened,setOpened}: DropzoneLoadingModalProps) => {
    const timer = useRef(0);
    const min = 5;
    const max = 20;
    const progressSpeed = Math.floor(Math.random() * (max - min + 1)) + min;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (opened) {
            timer.current = window.setInterval(() => {
                setProgress((prevProgress) => {
                    const newProgress = prevProgress + progressSpeed;
                    if (newProgress >= 100) {
                        window.clearInterval(timer.current);
                        return 100; // Cap progress at 100
                    }
                    return newProgress;
                });
            }, 500);
        }

        // Clear the interval when the modal is closed
        return () => {
            window.clearInterval(timer.current);
            setProgress(0); // Reset progress when modal is closed
        };
    }, [opened]);

    return (
        <Modal closeButtonProps={{hidden: true}} opened={opened} onClose={() => {
            setOpened(false);
        }}>
            This is your video upload progress...
            <Progress animated value={progress}/>
        </Modal>
    )
}