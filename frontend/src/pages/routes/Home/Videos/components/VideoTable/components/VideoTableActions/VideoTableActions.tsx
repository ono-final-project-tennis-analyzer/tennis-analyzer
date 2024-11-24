import React, { useState } from "react";
import { Button, Group, Modal, Progress, Text } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import Dropzone from "@/components/Dropzone";
import { useUploadFileMutation } from "@/services/file.service.ts";
import useFakeProgress from "@/hooks/useFakeProgress.ts";
import { useDisclosure } from "@mantine/hooks";

const VideoTableActions: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isUploading, setUploading] = useState(false);

  const progress = useFakeProgress(isUploading, { minSpeed: 5, maxSpeed: 20 });

  const uploadFile = useUploadFileMutation((data) => {
    setTimeout(() => {
      close();
      setUploading(false);
    }, 5000);
  });

  const onUpload = (file: File) => {
    uploadFile.mutate(file);
    setUploading(true);
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
    </Group>
  );
};

export default VideoTableActions;
