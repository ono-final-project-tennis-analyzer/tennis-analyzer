import {Card, Grid, Title, Text, List} from "@mantine/core";
import {DropzoneComponent} from "../Dashboard/Dropzone/DropzoneComponent.tsx";
import en from "../../../lang/en.json";
import {BarChart, DonutChart, LineChart, PieChart} from "@mantine/charts";
import {mockData} from "../../MockData.ts";
export default function Home() {

    return (

        <Grid gutter={"md"}>
            <Grid.Col span={12}>
                <Title>{en.Home.title}</Title>
                <Text>{en.Home.subtitle}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
                 <Grid gutter={"md"}>
                     <Grid.Col span={12}>
                    <Card shadow="sm" radius="md" withBorder>
                        <DropzoneComponent/>

                    </Card>
                     </Grid.Col>
                           <Grid.Col span={12}>
                    <Card  shadow="sm" radius="md" withBorder>
                        <Title order={4}>{mockData.Tips.title}</Title>
                        <Text>{mockData.Tips.description}</Text>
                        <List>
                        {mockData.Tips.data.map((tip, index) =>{
                            return  <List.Item key={index}> {tip}</List.Item>
                        } )}
                        </List>
                    </Card>
                     </Grid.Col>


                </Grid>
            </Grid.Col>
            <Grid.Col span={6}>
                <Card style={{ height: "100%" }} shadow="sm" radius="md" withBorder>
                    <Title order={4}>{mockData.ServeSpeed.title}</Title>
                      <LineChart
                          h={300}
                          data={mockData.ServeSpeed.data}
                          dataKey="month"
                          series={[
                            { name: 'speed', color: 'indigo.6' },
                          ]}
                          curveType="linear"
                    />
                </Card>
            </Grid.Col>

            <Grid.Col span={4}>
                <Card style={{height:"100%" ,width:"100%"}} shadow="sm" radius="md" withBorder>
                    <Title order={4}>{mockData.AccuracyChart.title}</Title>
                    <BarChart w={300} h={300}  style={{margin:"auto"}} series={[
                        {name: "Accuracy",
                            color: "yellow.6"}
                    ]}  dataKey={"Month"}
                              data={mockData.AccuracyChart.data}/>

                </Card>
            </Grid.Col>
            <Grid.Col span={4}>
                <Card style={{height:"100%"}} shadow="sm" radius="md" withBorder>
                    <Title order={4}>{mockData.StrokeTypes.title}</Title>
                    <PieChart w={300} h={300} data={mockData.StrokeTypes.data} withTooltip tooltipDataSource="segment" mx="auto"   withLabels />
                </Card>
            </Grid.Col>
            <Grid.Col span={4}>
                <Card style={{height:"100%"}} shadow="sm" radius="md" withBorder>
                    <Title order={4}>{mockData.MatchOutcome.title}</Title>
                    <DonutChart style={{margin:"auto"}} w={300} h={300}  data={mockData.MatchOutcome.data} withLabels withTooltip />
                </Card>
            </Grid.Col>

        </Grid>
    );
}
