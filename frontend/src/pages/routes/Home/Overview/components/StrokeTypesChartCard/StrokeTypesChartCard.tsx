import { Card, Title } from "@mantine/core";
import { PieChart } from "@mantine/charts";
import { mockData } from "../../../../../../MockData.ts";

export default function StrokeTypesChartCard() {
  return (
    <Card style={{ height: "100%" }} shadow="sm" radius="md" withBorder>
      <Title order={4}>{mockData.StrokeTypes.title}</Title>
      <PieChart
        w={300}
        h={300}
        data={mockData.StrokeTypes.data}
        withTooltip
        tooltipDataSource="segment"
        mx="auto"
        withLabels
      />
    </Card>
  );
}
