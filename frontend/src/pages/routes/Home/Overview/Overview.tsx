import { Grid } from "@mantine/core";
import PageHeader from "./components/PageHeader";
import DropzoneCard from "./components/DropzoneCard";
import TipsCard from "./components/TipsCard";
import ServeSpeedChart from "./components/ServeSpeedChart";
import AccuracyChartCard from "./components/AccuracyChartCard";
import StrokeTypesChartCard from "./components/StrokeTypesChartCard";
import MatchOutcomeChartCard from "./components/MatchOutcomeChartCard";

export default function Overview() {
  return (
    <Grid gutter="md">
      <Grid.Col span={12}>
        <PageHeader />
      </Grid.Col>
      <Grid.Col span={6}>
        <Grid gutter="md">
          <Grid.Col span={12}>
            <DropzoneCard />
          </Grid.Col>
          <Grid.Col span={12}>
            <TipsCard />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={6}>
        <ServeSpeedChart />
      </Grid.Col>
      <Grid.Col span={4}>
        <AccuracyChartCard />
      </Grid.Col>
      <Grid.Col span={4}>
        <StrokeTypesChartCard />
      </Grid.Col>
      <Grid.Col span={4}>
        <MatchOutcomeChartCard />
      </Grid.Col>
    </Grid>
  );
}
