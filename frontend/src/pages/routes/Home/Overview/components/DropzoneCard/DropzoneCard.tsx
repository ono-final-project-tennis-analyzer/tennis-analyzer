import { Card } from "@mantine/core";
import { DropzoneComponent } from "@/components/Dashboard/Dropzone/DropzoneComponent.tsx";

export default function DropzoneCard() {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <DropzoneComponent />
    </Card>
  );
}
