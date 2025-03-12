import { Grid, Loader } from "@mantine/core";
import PlayGroundTest from "../Overview/components/PlayGroundTest";
import TimescaleSlider from "./Components/VideoTopControls/components/TimescaleSlider";
import Time from "./Components/VideoTopControls/components/Time";
import VideoPlayer from "./Components/VideoPlayer/VideoPlayer";
import ForendBackendChart from "./Components/ForendBackendChart/ForendBackendChart";
import Score from "./Components/Score/Score";
import EventsTable from "./Components/EventsTable/EventsTable";
import React from "react";
import VideoTopControls from "./Components/VideoTopControls";
import { useParams } from "react-router-dom";
import { useGetVideoQuery } from "@/services/videos.service.ts";

export default function Video() {

  const { id } = useParams();
  const getVideoQuery = useGetVideoQuery(id);
  if(getVideoQuery.isLoading){
    return <Loader />
  }
  console.log(getVideoQuery.data)
  return (
    <Grid gutter="md">
      {/* Top Bar */}
      <Grid.Col span={12}>
        <VideoTopControls />
      </Grid.Col>

      {/* Video, Carts and Court Playground */}

      <Grid.Col span={12}>
        <Grid gutter="md">
          <Grid.Col span={5} style={{ maxHeight: "500px" }}>
            <VideoPlayer />
          </Grid.Col>
          <Grid.Col span={3} style={{ maxHeight: "500px" }}>
            <Grid gutter="md">
              <Grid.Col span={12}>
                <ForendBackendChart />
              </Grid.Col>
              <Grid.Col span={12}>
                <Score Player1Score={10} Player2Score={20} />
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={4} style={{ maxHeight: "500px" }}>
            <PlayGroundTest />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={12}>
        <EventsTable />
      </Grid.Col>
    </Grid>
  );
}
