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

export default function Overview() {

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
      <Grid.Col span={2}>
        {/* <ServeSpeedChart /> */}
        <StatComponent title={"Forent Count"} value={100} percentage={50} color="red" />
      </Grid.Col>
      <Grid.Col span={2}>
      <StatComponent title={"Serve Speed"} value={100} percentage={50} color="blue" />
      </Grid.Col>
      <Grid.Col span={4}>
        <StrokeTypesChartCard  />
      </Grid.Col>
      <Grid.Col span={4}>
        <MatchOutcomeChartCard />
      </Grid.Col>

      <Grid.Col span={12}>

        
      </Grid.Col>
    </Grid>
  );
}
