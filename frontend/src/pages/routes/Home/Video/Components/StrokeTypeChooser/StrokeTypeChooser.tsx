import {
  VideoEvent,
  EStrokeType,
  getStrokeTypeText,
} from "@/@types/VideoEvent";
import { useClassifyVideoStrokeTypeMutation } from "@/services/event.service";
import { Modal, Select, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { UseQueryResult } from "@tanstack/react-query";
import { VideoEventQueryResponse } from "@/@types/VideoEvent";

type StrokeTypeChooserProps = {
  event: VideoEvent | undefined;
  setEvent: (event: VideoEvent | undefined) => void;
  getVideoWithEventsQuery: UseQueryResult<VideoEventQueryResponse, Error>;
};

const StrokeTypeChooser = ({
  event,
  setEvent,
  getVideoWithEventsQuery,
}: StrokeTypeChooserProps) => {
  const form = useForm({
    initialValues: {
      strokeType: null,
    },
  });

  const classifyVideoStrokeTypeMutation = useClassifyVideoStrokeTypeMutation();

  return (
    <Modal
      title="Choose Stroke Type"
      opened={!!event}
      onClose={() => {
        setEvent(undefined);
      }}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (!values.strokeType || !event) return;

          classifyVideoStrokeTypeMutation.mutate(
            [
              {
                stroke_type: parseInt(values.strokeType),
                event_id: parseInt(event.id),
              },
            ],
            {
              onSuccess: () => {
                setEvent(undefined);
                form.reset();
                getVideoWithEventsQuery.refetch();
              },
            },
          );
        })}
      >
        <Select
          {...form.getInputProps("strokeType")}
          label="Stroke Type"
          required
          data={Object.values(EStrokeType)
            .filter(
              (strokeType) =>
                getStrokeTypeText(strokeType as EStrokeType) !== "Unknown",
            )
            .map((strokeType) => ({
              value: strokeType.toString(),
              label: getStrokeTypeText(strokeType as EStrokeType),
            }))}
        />
        <Button
          type="submit"
          loading={classifyVideoStrokeTypeMutation.isPending}
          style={{ marginTop: "12px" }}
        >
          Set Stroke Type
        </Button>
      </form>
    </Modal>
  );
};

export default StrokeTypeChooser;
