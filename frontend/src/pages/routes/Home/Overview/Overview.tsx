import { Grid } from "@mantine/core";
import PageHeader from "./components/PageHeader";
import TipsCard from "./components/TipsCard";
import StrokeTypesChartCard from "./components/StrokeTypesChartCard";
import MatchOutcomeChartCard from "./components/MatchOutcomeChartCard";
import StatComponent from "./components/StatComponentChartCard";
import { useGetStrokeTypeStats } from "@/services/event.service";
import {
  EStrokeType,
  getStrokeTypeColor,
  getStrokeTypeText,
} from "@/@types/VideoEvent";

export default function Overview() {
  const getStrokeTypesQuery = useGetStrokeTypeStats();
  return (
    <Grid gutter="md">
      <Grid.Col span={12}>
        <PageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <Grid gutter="md">
          <Grid.Col span={12}>
            <TipsCard />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={6}>
        <StrokeTypesChartCard strokeTypes={getStrokeTypesQuery.data ?? {}} />
      </Grid.Col>
      <Grid.Col span={6}>
        <MatchOutcomeChartCard />
      </Grid.Col>
      {getStrokeTypesQuery.data &&
        Object.entries(getStrokeTypesQuery.data).map(([strokeType, count]) => (
          <Grid.Col span={2}>
            <StatComponent
              title={getStrokeTypeText(strokeType as EStrokeType)}
              value={count}
              percentage={50}
              color={getStrokeTypeColor(strokeType as EStrokeType)}
            />
          </Grid.Col>
        ))}
    </Grid>
  );
}
