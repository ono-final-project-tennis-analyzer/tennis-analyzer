import { TennisPlaygroundMapPointType } from "@/components/tennis-playground-map/tennis-playground-map.component";

export const pointTypeMapping: Record<string, TennisPlaygroundMapPointType> = {
  ball_bounce: TennisPlaygroundMapPointType.BALL_BOUNCE,
  top_player_stroke: TennisPlaygroundMapPointType.TOP_PLAYER_STROKE,
  bottom_player_stroke: TennisPlaygroundMapPointType.BOTTOM_PLAYER_STROKE,
};

export const getPointType = (
  eventType: string,
): TennisPlaygroundMapPointType => {
  if (pointTypeMapping[eventType]) {
    return pointTypeMapping[eventType];
  }
  console.warn("Unknown event type:", eventType);
  return TennisPlaygroundMapPointType.BALL_BOUNCE;
};
