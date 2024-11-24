import { Card, Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { mockData } from "../../../../../../MockData.ts";

export default function AccuracyChartCard() {
  return (
    <Card
      style={{ height: "100%", width: "100%" }}
      shadow="sm"
      radius="md"
      withBorder
    >
      <Title order={4}>{mockData.AccuracyChart.title}</Title>
      <BarChart
        w={300}
        h={300}
        style={{ margin: "auto" }}
        series={[{ name: "Accuracy", color: "yellow.6" }]}
        dataKey="Month"
        data={mockData.AccuracyChart.data}
      />
    </Card>
  );
}
