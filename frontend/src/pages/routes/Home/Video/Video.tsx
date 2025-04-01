import { Grid, Loader } from "@mantine/core";
import PlayGround from "../Overview/components/PlayGround";
import VideoPlayer from "./Components/VideoPlayer/VideoPlayer";
import EventsTable from "./Components/EventsTable/EventsTable";
import VideoTopControls from "./Components/VideoTopControls";
import { useParams } from "react-router-dom";
import {
  useGetVideoWithEventsQuery,
  useStreamVideoQuery,
} from "@/services/videos.service.ts";
import { useVideoContext } from "./context";
import { useEffect, useState, useMemo } from "react";
import { VideoEvent } from "@/@types/VideoEvent";
import StrokeTypeChooser from "./Components/StrokeTypeChooser";
import { EStrokeType } from "@/@types/VideoEvent";

export default function Video() {
  const { id } = useParams();
  const getVideoWithEventsQuery = useGetVideoWithEventsQuery(id);
  const { streamUrl } = useStreamVideoQuery(id);
  const { setUrl } = useVideoContext();
  const videoEvents =
    getVideoWithEventsQuery.data?.data.data.video_events ?? [];
  const [event, setEvent] = useState<VideoEvent | undefined>(undefined);

  useEffect(() => {
    if (streamUrl) {
      setUrl(streamUrl);
    }
  }, [streamUrl, setUrl]);

  const strokeTypes = useMemo(() => {
    // First filter for only stroke type events
    const strokeEvents = videoEvents.filter((event) =>
      Object.values(EStrokeType).includes(event.event_type as EStrokeType),
    );

    // Then reduce to count by type
    return strokeEvents.reduce((acc: { [key: string]: number }, event) => {
      if (event.event_type) {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      }
      return acc;
    }, {});
  }, [videoEvents]);

  if (getVideoWithEventsQuery.isLoading) {
    return <Loader />;
  }

  return (
    <Grid gutter="md">
      <Grid.Col span={12}>
        <VideoTopControls />
      </Grid.Col>

      <Grid.Col span={12}>
        <Grid gutter="md">
          <Grid.Col span={9} style={{ maxHeight: "400px" }}>
            <VideoPlayer videoId={id as string}/>
          </Grid.Col>
          <Grid.Col span={3} style={{ maxHeight: "400px" }}>
            <PlayGround events={videoEvents} />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={12}>
        <EventsTable
          onSetStrokeType={setEvent}
          events={getVideoWithEventsQuery.data?.data.data.video_events ?? []}
        />

        <StrokeTypeChooser
          getVideoWithEventsQuery={getVideoWithEventsQuery}
          event={event}
          setEvent={setEvent}
        />
      </Grid.Col>
    </Grid>
  );
}
