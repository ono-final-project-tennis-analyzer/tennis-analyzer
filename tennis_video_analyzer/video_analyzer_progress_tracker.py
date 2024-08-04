from db.stores import EventStore


class VideoAnalyzerProgressTracker:
    def __init__(self, total_frames, event_id=0):
        self.total_frames = total_frames
        self.current_frame = 0
        self.event_id = event_id

    def update_progress(self, current_frame):
        self.current_frame = current_frame
        print(f'Progress: {int((self.current_frame / self.total_frames) * 100)}')

        if self.event_id:
            print(f'Event ID: {self.event_id}')
