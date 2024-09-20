import {Card, Grid} from "@mantine/core";
import {DropzoneComponent} from "../Dashboard/Dropzone/DropzoneComponent.tsx";

export default function Home() {


    return (
        <Grid gutter={8}>
            <Grid.Col span={3}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <DropzoneComponent/>
                </Card>
            </Grid.Col>

        </Grid>
    );
}
