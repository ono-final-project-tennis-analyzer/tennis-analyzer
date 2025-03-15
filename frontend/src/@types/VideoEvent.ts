export interface VideoEvent {
        created_at: string,
        event_type: EVideoEventType | EStrokeType,
        frame_number: number,
        id: string,
        metadata: {
          position?: {
            x: number,
            y: number
          },
          raw_position?: {
            x: number,
            y: number
          }
        },
        time_seconds: number,
        time_string: string,
        updated_at: string,
        video_id: number
}

export interface VideoEventQueryResponse {
    data: {
        data: {
            created_at: string,
            id: number,
            title: string,
            updated_at: string,
            video_events: VideoEvent[]
        }
    }
}

export enum EVideoEventType {
  BallBounce = 'ball_bounce',
  TopPlayerStroke = 'top_player_stroke',
  BottomPlayerStroke = 'bottom_player_stroke'
}
export enum EStrokeType {
  Forehand = 'forehand',
  Backhand = 'backhand',
  Serve = 'serve',
  ForehandVolley = 'forehand_volley',
  BackhandVolley = 'backhand_volley',
  BackhandSlice = 'backhand_slice',
  ForehandSlice = 'forehand_slice',
  ServeSlice = 'serve_slice',
  DropShot = 'drop_shot',
  Smash = 'smash',
  Net = 'net',
}

export function getStrokeTypeText(strokeType: EStrokeType){
  switch(strokeType) {
    case EStrokeType.Forehand:
      return 'Forehand';
    case EStrokeType.Backhand:
      return 'Backhand';
    case EStrokeType.Serve:
      return 'Serve';
    case EStrokeType.ForehandVolley:
      return 'Forehand Volley';
    case EStrokeType.BackhandVolley:
      return 'Backhand Volley';
    case EStrokeType.BackhandSlice:
      return 'Backhand Slice';
    case EStrokeType.ForehandSlice:
      return 'Forehand Slice';
    case EStrokeType.ServeSlice:
      return 'Serve Slice';
    case EStrokeType.DropShot:
      return 'Drop Shot';
    case EStrokeType.Smash:
      return 'Smash';
    case EStrokeType.Net:
      return 'Net';
    default:
      return 'Unknown';
  }
}
export function getVideoEventTypeText(videoEventType: EVideoEventType){
  switch(videoEventType) {
    case EVideoEventType.BallBounce:
      return 'Ball Bounce';
    case EVideoEventType.TopPlayerStroke:
      return 'Top Player Stroke';
    case EVideoEventType.BottomPlayerStroke:
      return 'Bottom Player Stroke';
    default:
      return 'Unknown';
  }
}
