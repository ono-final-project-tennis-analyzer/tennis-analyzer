export interface VideoEvent {
  created_at: string;
  event_type: EVideoEventType | EStrokeType;
  frame_number: number;
  id: string;
  metadata: {
    position?: {
      x: number;
      y: number;
    };
    raw_position?: {
      x: number;
      y: number;
    };
  };
  time_seconds: number;
  time_string: string;
  updated_at: string;
  video_id: number;
}

export interface VideoEventQueryResponse {
  data: {
    data: {
      created_at: string;
      id: number;
      title: string;
      updated_at: string;
      video_events: VideoEvent[];
    };
  };
}

export enum EVideoEventType {
  BallBounce = "ball_bounce",
  TopPlayerStroke = "top_player_stroke",
  BottomPlayerStroke = "bottom_player_stroke",
}
export enum EStrokeType {
  Forehand = "0",
  Backhand = "1",
  Serve = "2",
  ForehandVolley = "3",
  BackhandVolley = "4",
  BackhandSlice = "5",
  ForehandSlice = "6",
  ServeSlice = "7",
  DropShot = "8",
  Smash = "9",
  Net = "10",
}

export function getStrokeTypeText(strokeType: EStrokeType) {
  switch (strokeType) {
    case EStrokeType.Forehand:
      return "Forehand";
    case EStrokeType.Backhand:
      return "Backhand";
    case EStrokeType.Serve:
      return "Serve";
    case EStrokeType.ForehandVolley:
      return "Forehand Volley";
    case EStrokeType.BackhandVolley:
      return "Backhand Volley";
    case EStrokeType.BackhandSlice:
      return "Backhand Slice";
    case EStrokeType.ForehandSlice:
      return "Forehand Slice";
    case EStrokeType.ServeSlice:
      return "Serve Slice";
    case EStrokeType.DropShot:
      return "Drop Shot";
    case EStrokeType.Smash:
      return "Smash";
    case EStrokeType.Net:
      return "Net";
    default:
      return "Unknown";
  }
}
export function getVideoEventTypeText(videoEventType: EVideoEventType) {
  switch (videoEventType) {
    case EVideoEventType.BallBounce:
      return "Ball Bounce";
    case EVideoEventType.TopPlayerStroke:
      return "Top Player Stroke";
    case EVideoEventType.BottomPlayerStroke:
      return "Bottom Player Stroke";
    default:
      return "Unknown";
  }
}

export function getStrokeTypeColor(strokeType: EStrokeType): string {
  switch (strokeType) {
    case EStrokeType.Forehand:
      return "#FA5252";
    case EStrokeType.Backhand:
      return "#339af0";
    case EStrokeType.Serve:
      return "#40c057";
    case EStrokeType.ForehandVolley:
      return "#fcc419";
    case EStrokeType.BackhandVolley:
      return "#f03e3e";
    case EStrokeType.BackhandSlice:
      return "#E64980";
    case EStrokeType.ForehandSlice:
      return "#E64980";
    case EStrokeType.ServeSlice:
      return "#E64980";
    case EStrokeType.DropShot:
      return "#E64980";
    case EStrokeType.Smash:
      return "#E64980";
    case EStrokeType.Net:
      return "#E64980";
    default:
      return "#E64980";
  }
}
