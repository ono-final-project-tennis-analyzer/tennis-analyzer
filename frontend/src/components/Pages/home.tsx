import {Card, Grid, Title} from "@mantine/core";
import {DropzoneComponent} from "../Dashboard/Dropzone/DropzoneComponent.tsx";

export default function Home() {


    return (

        <Grid gutter={"md"}>
            <Grid.Col span={12}>
                <Title>Welcome!</Title>
            </Grid.Col>
            <Grid.Col dir={"vertical"}>
                <Grid.Col span={6}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <DropzoneComponent/>
                    </Card>
                </Grid.Col>

                <Grid.Col span={6}>

                </Grid.Col>
            </Grid.Col>
        </Grid>
    );
}
