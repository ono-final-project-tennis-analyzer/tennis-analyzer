import { Grid } from "@mantine/core";
import PageHeader from "./components/PageHeader";
import DropzoneCard from "./components/DropzoneCard";
import TipsCard from "./components/TipsCard";
import ServeSpeedChart from "./components/ServeSpeedChart";
import AccuracyChartCard from "./components/AccuracyChartCard";
import StrokeTypesChartCard from "./components/StrokeTypesChartCard";
import MatchOutcomeChartCard from "./components/MatchOutcomeChartCard";
import { TennisPlaygroundMap } from "@/components/tennis-playground-map/tennis-playground-map.component";
import PlayGroundTest from "./components/PlayGroundTest";
import StatComponent from "./components/StatComponentChartCard";
import { useGetStrokeTypeStats } from "@/services/event.service";
import { EStrokeType, getStrokeTypeColor, getStrokeTypeText } from "@/@types/VideoEvent";

export default function Overview() {
const getStrokeTypesQuery= useGetStrokeTypeStats();
  return (
    <Grid gutter="md">
      <Grid.Col span={12}>
        <PageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <Grid gutter="md">
          <Grid.Col span={12}>
            <DropzoneCard />
          </Grid.Col>
          <Grid.Col span={12}>
            <TipsCard />
          </Grid.Col>
        </Grid>
      </Grid.Col>

      {getStrokeTypesQuery.data && (Object.entries(getStrokeTypesQuery.data).map(([strokeType, count]) => (
        <Grid.Col span={2}>
          <StatComponent title={getStrokeTypeText(strokeType as EStrokeType)} value={count} percentage={50} color={getStrokeTypeColor(strokeType as EStrokeType)} />
        </Grid.Col>
      )))}  

      <Grid.Col span={4}>
        <StrokeTypesChartCard  />
      </Grid.Col>
      <Grid.Col span={4}>
        <MatchOutcomeChartCard />
      </Grid.Col>

    </Grid>
  );
}
