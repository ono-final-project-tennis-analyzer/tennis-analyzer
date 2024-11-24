import React, { useState, useEffect } from "react";
import { Modal, Text } from "@mantine/core";

export enum VideoType {
  ORIGINAL = "original",
  PROCESSED = "processed",
}

interface VideoPlayerModalProps {
  videoId?: number;
  type?: VideoType;
  opened: boolean;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  videoId,
  type,
  opened,
  onClose,
}) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (opened && type && videoId) {
      // Set the video stream URL when the modal is opened
      setVideoSrc(`http://localhost:8081/videos/stream/${type}/${videoId}`);
    } else {
      // Cleanup the video source when the modal is closed
      setVideoSrc(null);
    }
  }, [opened, type, videoId]);

  return (
    <Modal
      size="xl"
      opened={opened}
      onClose={onClose}
      title={`Playing ${type === VideoType.ORIGINAL ? "Original" : "Processed"} Video`}
    >
      {videoSrc ? (
        <video
          src={videoSrc}
          controls
          autoPlay
          style={{ width: "100%", height: "auto" }}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <Text>Loading video...</Text>
      )}
    </Modal>
  );
};

export default VideoPlayerModal;
