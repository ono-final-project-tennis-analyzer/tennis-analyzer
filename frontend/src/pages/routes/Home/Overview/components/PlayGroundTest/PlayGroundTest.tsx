import { TennisPlaygroundMap, TennisPlaygroundMapPointType } from "@/components/tennis-playground-map/tennis-playground-map.component";
import { useEffect, useState } from "react";
import { useVideoContext } from '../../../Video/context';
import { VideoEvent } from '@/@types/VideoEvent';

interface Point {
  id: string;
  type: TennisPlaygroundMapPointType;
  x: number;
  y: number;
}

interface PlayGroundTestProps {
  events?: VideoEvent[];
}

const PlayGroundTest: React.FC<PlayGroundTestProps> = ({ events = [] }) => {
  const { state: { currentTime } } = useVideoContext();
  const [points, setPoints] = useState<Point[]>([]);

  const getPointType = (eventType: string): TennisPlaygroundMapPointType => {
    switch (eventType) {
      case 'ball_bounce':
        return TennisPlaygroundMapPointType.BALL_BOUNCE;
      case 'top_player_stroke':
        return TennisPlaygroundMapPointType.TOP_PLAYER_STROKE;
      case 'bottom_player_stroke':
        return TennisPlaygroundMapPointType.BOTTOM_PLAYER_STROKE;
      default:
        console.warn('Unknown event type:', eventType);
        return TennisPlaygroundMapPointType.BALL_BOUNCE;
    }
  };

  useEffect(() => {
    if (!events?.length) return;

    // Find events that match the current time
    const matchingEvents = events.filter(event => {
      const timeWindow = 0.1; // Reduced time window for more precise matching
      const isInTimeWindow = Math.abs(event.time_seconds - currentTime) < timeWindow;
      
      // Debug logging
      if (isInTimeWindow) {
        console.log('Matching event found:', {
          type: event.event_type,
          time: event.time_seconds,
          currentTime,
          position: event.metadata.position,
        });
      }
      
      return isInTimeWindow && event.metadata?.position;
    });

    if (matchingEvents.length > 0) {
      const newPoints = matchingEvents.map(event => {
        const position = event.metadata.position;
        if (!position) {
          console.warn('Event missing position data:', event);
          return null;
        }

        // Debug log the normalized position
        console.log('Creating point:', {
          id: event.id,
          type: event.event_type,
          x: position.x,
          y: position.y
        });

        return {
          id: event.id,
          type: getPointType(event.event_type),
          x: position.x, // Already normalized from backend (-1 to 1)
          y: position.y, // Already normalized from backend (-1 to 1)
        };
      }).filter((point): point is Point => point !== null);

      setPoints(newPoints); // Directly set new points instead of merging
    }
  }, [currentTime, events]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <TennisPlaygroundMap 
        scale={Math.min(
          (document.getElementById('tennis-playground-map')?.parentElement?.clientWidth ?? 0) / 150 || 3,
          (document.getElementById('tennis-playground-map')?.parentElement?.clientHeight ?? 0) / 300 || 3
        ) ?? 1} 
        playerScale={4}
        ballScale={0.5}
        points={points} 
      />
    </div>
  );
};

export default PlayGroundTest;
