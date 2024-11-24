import { Card, Title } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import { mockData } from "../../../../../../MockData.ts";

export default function MatchOutcomeChartCard() {
  return (
    <Card style={{ height: "100%" }} shadow="sm" radius="md" withBorder>
      <Title order={4}>{mockData.MatchOutcome.title}</Title>
      <DonutChart
        style={{ margin: "auto" }}
        w={300}
        h={300}
        data={mockData.MatchOutcome.data}
        withLabels
        withTooltip
      />
    </Card>
  );
}
