import { Grid } from "@mantine/core";
import PlayGroundTest from "../Overview/components/PlayGroundTest";
import TimescaleSlider from "./Components/TimescaleSlider";
import PlayAndPauseButton from "./Components/PlayAndPauseButton/PlayAndPauseButton";
import Time from "./Components/Time";
import VideoPlayer from "./Components/VideoPlayer/VideoPlayer";
import ForendBackendChart from "./Components/ForendBackendChart/ForendBackendChart";
import Score from "./Components/Score/Score";
export default function Video() {
  return  <Grid gutter="md">
    {/* Top Bar */}
    <Grid.Col span={12}>
      <Grid gutter="none">
      <Grid.Col span={8}>
        <TimescaleSlider />
      </Grid.Col>
      <Grid.Col span={1}>
        <PlayAndPauseButton isPlaying={false} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Time />
      </Grid.Col>
      </Grid>
    </Grid.Col>

    {/* Video, Carts and Court Playground */}


    <Grid.Col span={12} >
      <Grid gutter="md">
        <Grid.Col span={5} style={{maxHeight: '500px'}}>
         <VideoPlayer />
        </Grid.Col>
        <Grid.Col span={3} style={{maxHeight: '500px'}}>
          <Grid gutter="md">
            <Grid.Col span={12}>
              <ForendBackendChart/>
            </Grid.Col>
            <Grid.Col span={12}>
              <Score Player1Score={10} Player2Score={20} />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={4} style={{maxHeight: '500px'}}>
        <PlayGroundTest  />
        </Grid.Col>
      </Grid>
    </Grid.Col>
      </Grid>;    
}

    