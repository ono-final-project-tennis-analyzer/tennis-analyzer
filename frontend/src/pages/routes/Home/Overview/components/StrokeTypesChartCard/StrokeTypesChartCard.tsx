import { Card, Title } from "@mantine/core";
import { PieChart } from "@mantine/charts";
import { mockData } from "../../../../../../MockData.ts";
import { EStrokeType, getStrokeTypeColor, getStrokeTypeText } from "@/@types/VideoEvent";
  
export default function StrokeTypesChartCard({ strokeTypes }: { strokeTypes: { [key: string]: number } }) {
  return (
    <Card style={{ height: "100%" }} shadow="sm" radius="md" withBorder>
      <Title order={4}>{mockData.StrokeTypes.title}</Title>
      <PieChart
        w={300}
        h={300}
        data={Object.entries(strokeTypes).map(([strokeType, count]) => ({
          name: getStrokeTypeText(strokeType as EStrokeType),
          value: count,
          color: getStrokeTypeColor(strokeType as EStrokeType),
        }))}
        withTooltip
        tooltipDataSource="segment"
        mx="auto"
        withLabels
      />
    </Card>
  );
}
