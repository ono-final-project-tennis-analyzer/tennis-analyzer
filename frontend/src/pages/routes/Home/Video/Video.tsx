import { Grid, Loader } from "@mantine/core";
import PlayGroundTest from "../Overview/components/PlayGroundTest";
import VideoPlayer from "./Components/VideoPlayer/VideoPlayer";
import ForendBackendChart from "./Components/ForendBackendChart/ForendBackendChart";
import Score from "./Components/Score/Score";
import EventsTable from "./Components/EventsTable/EventsTable";
import VideoTopControls from "./Components/VideoTopControls";
import { useParams } from "react-router-dom";
import { useGetVideoWithEventsQuery, useStreamVideoQuery } from "@/services/videos.service.ts";
import { useVideoContext } from "./context";
import { useEffect, useState } from "react";
import { VideoEvent } from "@/@types/VideoEvent";
import StrokeTypeChooser from "./Components/StrokeTypeChooser";

export default function Video() {
  const { id } = useParams();
  const getVideoWithEventsQuery = useGetVideoWithEventsQuery(id);
  const { streamUrl } = useStreamVideoQuery(id);
  const { setUrl } = useVideoContext();

  useEffect(() => {
    if (streamUrl) {
      setUrl(streamUrl);
    }
  }, [streamUrl, setUrl]);

  if(getVideoWithEventsQuery.isLoading){
    return <Loader />
  }

  const videoEvents = getVideoWithEventsQuery.data?.data.data.video_events ?? [];
  const [event, setEvent] = useState<VideoEvent | undefined>(undefined);
  return (
    <Grid gutter="md">
      <Grid.Col span={12}>
        <VideoTopControls />
      </Grid.Col>

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
                <Score Player1Score={0} Player2Score={0} />
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={4} style={{ maxHeight: "500px" }}>
            <PlayGroundTest events={videoEvents} />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={12}>
        <EventsTable onSetStrokeType={(event: VideoEvent)=>{
          console.log("user clicked set stroke type to event : ", event);
          setEvent(event);
        }} events={getVideoWithEventsQuery.data?.data.data.video_events ?? []} />

        <StrokeTypeChooser getVideoWithEventsQuery={getVideoWithEventsQuery} event={event} setEvent={setEvent} />
      </Grid.Col>
    </Grid>
  );
}
