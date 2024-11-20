import {Card, Grid, Title, Text, Flex} from "@mantine/core";
import {DropzoneComponent} from "../Dashboard/Dropzone/DropzoneComponent.tsx";
import en from "../../../lang/en.json";

export default function Home() {

    return (

        <Grid gutter={"md"}>
            <Grid.Col span={12}>
                <Title>{en.Home.title}</Title>
                <Text>{en.Home.subtitle}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
                <Flex direction={"column"}>
                    <Card shadow="sm" radius="md" withBorder>
                        <DropzoneComponent/>

                    </Card>

                    <Card shadow="sm" radius="md" withBorder>
                        PlaceHolder
                    </Card>
                </Flex>
            </Grid.Col>

            <Grid.Col span={6}>

            </Grid.Col>
        </Grid>
    );
}
