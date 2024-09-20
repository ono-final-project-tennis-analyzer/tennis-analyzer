import {Grid} from "@mantine/core";
import {DropzoneComponent} from "../Dashboard/Dropzone/DropzoneComponent.tsx";

export default function Home() {


    return (
        <Grid gutter={8}>
            <Grid.Col span={3}>
                <DropzoneComponent/>
            </Grid.Col>

        </Grid>
    );
}
