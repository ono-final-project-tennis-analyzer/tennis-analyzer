import { useEffect, useState } from "react";
import { Point } from "../PlayGround.types";
import { VideoEvent } from "@/@types/VideoEvent";
import { getPointType } from "../PlayGround.utils";

const TIME_WINDOW = 0.1;

const filterMatchingEvents = (
  events: VideoEvent[],
  currentTime: number,
): VideoEvent[] => {
  return events.filter((event) => {
    const isInTimeWindow =
      Math.abs(event.time_seconds - currentTime) < TIME_WINDOW;
    if (isInTimeWindow) {
      console.log("Matching event found:", {
        type: event.event_type,
        time: event.time_seconds,
        currentTime,
        position: event.metadata.position,
      });
    }
    return isInTimeWindow && event.metadata?.position;
  });
};

const mapEventsToPoints = (events: VideoEvent[]): Point[] => {
  return events
    .map((event) => {
      const position = event.metadata.position;
      if (!position) {
        console.warn("Event missing position data:", event);
        return null;
      }
      console.log("Creating point:", {
        id: event.id,
        type: event.event_type,
        x: position.x,
        y: position.y,
      });
      return {
        id: event.id,
        type: getPointType(event.event_type),
        x: position.x,
        y: position.y,
      } as Point;
    })
    .filter((point): point is Point => point !== null);
};

export const usePlaygroundPoints = (
  events: VideoEvent[] = [],
  currentTime: number,
): Point[] => {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (!events?.length) {
      setPoints([]);
      return;
    }

    const matchingEvents = filterMatchingEvents(events, currentTime);
    const newPoints = mapEventsToPoints(matchingEvents);
    setPoints(newPoints);
  }, [currentTime, events]);

  return points;
};
