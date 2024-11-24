import { Modal, Progress } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import useFakeProgress from "@/hooks/useFakeProgress.ts";

type DropzoneLoadingModalProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
};
export const DropzoneLoadingModal = ({
  opened,
  setOpened,
}: DropzoneLoadingModalProps) => {
  const progress = useFakeProgress(opened, { minSpeed: 5, maxSpeed: 20 });

  return (
    <Modal
      closeButtonProps={{ hidden: true }}
      opened={opened}
      onClose={() => setOpened(false)}
    >
      This is your video upload progress...
      <Progress animated value={progress} />
    </Modal>
  );
};
