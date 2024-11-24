import { Card, Title } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { mockData } from "../../../../../../MockData.ts";

export default function ServeSpeedChart() {
  return (
    <Card style={{ height: "100%" }} shadow="sm" radius="md" withBorder>
      <Title order={4}>{mockData.ServeSpeed.title}</Title>
      <LineChart
        h={300}
        data={mockData.ServeSpeed.data}
        dataKey="month"
        series={[{ name: "speed", color: "indigo.6" }]}
        curveType="linear"
      />
    </Card>
  );
}
