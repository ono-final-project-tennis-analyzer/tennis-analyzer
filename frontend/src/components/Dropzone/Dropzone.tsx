import { Group, rem, Text } from "@mantine/core";
import { IconUpload, IconVideo, IconX } from "@tabler/icons-react";
import { Dropzone as MDropzone } from "@mantine/dropzone";
import React from "react";

interface Props {
  onUpload: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onUpload }) => {
  return (
    <MDropzone
      maxFiles={1}
      onDrop={(files) => {
        onUpload(files[0]);
      }}
      accept={["video/*"]}
      maxSize={100 * 1024 ** 3}
      styles={{
        root: {
          border: `2px dashed var(--mantine-color-gray-4)`,
          borderRadius: rem(8),
          transition: "border-color 0.2s ease",
        },
      }}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <MDropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
            stroke={1.5}
          />
        </MDropzone.Accept>
        <MDropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
            stroke={1.5}
          />
        </MDropzone.Reject>
        <MDropzone.Idle>
          <IconVideo
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-dimmed)",
            }}
            stroke={1.5}
          />
        </MDropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag video here or click to select video file
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach your tennis video, file should not exceed 100mb
          </Text>
        </div>
      </Group>
    </MDropzone>
  );
};

export default Dropzone;
