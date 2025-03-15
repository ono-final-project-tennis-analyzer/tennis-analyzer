import { VideoEvent, EStrokeType } from "@/@types/VideoEvent";
import { Modal, Select, Button   } from "@mantine/core";
import { useForm } from "@mantine/form";

type StrokeTypeChooserProps = { 
  event: VideoEvent | undefined;
  setEvent: (event: VideoEvent | undefined) => void;
}

const StrokeTypeChooser = ({event,setEvent}: StrokeTypeChooserProps) => {
const form = useForm({
    initialValues: {
        strokeType: null
    }
})


  return <Modal title="Choose Stroke Type" opened={!!event} onClose={() => {
    setEvent(undefined);
  }}>
    <form onSubmit={form.onSubmit((values) => {
        console.log(values);
        
    })}>
        <Select {...form.getInputProps('strokeType')} label="Stroke Type" name="strokeType" key={form.key("strokeType")} data={Object.values(EStrokeType).map((strokeType) => ({
            value: strokeType,
            label: strokeType
        }))} />
        <Button type="submit">Set Stroke Type</Button>
    </form>
  </Modal>;
};

export default StrokeTypeChooser;

