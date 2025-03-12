export interface VideoEvent {
        created_at: string,
        event_type: 'ball_bounce' | 'top_player_stroke' | 'bottom_player_stroke'
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
