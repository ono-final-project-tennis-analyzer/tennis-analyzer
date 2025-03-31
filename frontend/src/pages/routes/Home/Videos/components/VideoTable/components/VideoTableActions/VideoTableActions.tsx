import React, { useState } from "react";
import { Button, Group, Modal, Progress, Text } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import Dropzone from "@/components/Dropzone";
import { useUploadFileMutation } from "@/services/file.service.ts";
import useFakeProgress from "@/hooks/useFakeProgress.ts";
import { useDisclosure } from "@mantine/hooks";
import TagPlayersWhenUploadComponent from "@/components/TagPlayersWhenUploadComponent/TagPlayersWhenUploadComponent";

const VideoTableActions: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isUploading, setUploading] = useState(false);
  const [tagPlayersModal, setTagPlayersModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const progress = useFakeProgress(isUploading, { minSpeed: 5, maxSpeed: 20 });

  const uploadFile = useUploadFileMutation((data) => {
    setTimeout(() => {
      close();
      setUploading(false);
    }, 5000);
  });

  const onUpload = (file: File) => {
    setSelectedFile(file);
    setTagPlayersModal(true);
  };

  const onSubmit = (topPlayer: number, bottomPlayer: number) => {
    if (selectedFile) {
      uploadFile.mutate({
        bottom_player_account_id: bottomPlayer,
        top_player_account_id: topPlayer,
        video: selectedFile
      });
      setUploading(true);
      setTagPlayersModal(false);
    }
  };

  return (
    <Group>
      <Button
        leftSection={<IconUpload />}
        variant="default"
        onClick={() => open()}
      >
        Upload
      </Button>

      <Modal
        closeButtonProps={{ hidden: true }}
        opened={opened}
        onClose={() => {
          close();
        }}
      >
        {!isUploading ? (
          <Dropzone onUpload={onUpload} />
        ) : (
          <div>
            <Text>Uploading your file...</Text>
            <Progress animated value={progress} mt="md" />
          </div>
        )}
      </Modal>

      <TagPlayersWhenUploadComponent 
        isOpen={tagPlayersModal} 
        onSubmit={onSubmit} 
        setOpenModal={setTagPlayersModal} 
      />
    </Group>
  );
};

export default VideoTableActions;
