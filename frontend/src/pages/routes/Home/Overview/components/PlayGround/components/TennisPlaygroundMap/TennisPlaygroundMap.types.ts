export enum TennisPlaygroundMapPointType {
  BALL_BOUNCE = "ball_bounce",
  TOP_PLAYER_STROKE = "top_player_stroke",
  BOTTOM_PLAYER_STROKE = "bottom_player_stroke"
}

export interface TennisPlaygroundMapPoint {
  id: string;
  type: TennisPlaygroundMapPointType;
  x: number;
  y: number;
}

export interface TennisPlaygroundMapProps {
  points?: TennisPlaygroundMapPoint[];
  scale?: number;
  playerScale?: number;
  ballScale?: number;
}
