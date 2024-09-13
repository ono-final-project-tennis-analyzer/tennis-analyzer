from db.stores.events_store import EventStore


class VideoAnalyzerProgressTracker:
    def __init__(self, session, total_frames, event_id=0):
        self.total_frames = total_frames
        self.current_frame = 0
        self.event_id = event_id
        self.events_store = EventStore(session=session)

    def update_progress(self, current_frame):
        self.current_frame = current_frame
        progress = int((self.current_frame / self.total_frames) * 100)
        print(f'Progress: {progress}%')

        if self.event_id:
            self.events_store.update_event(self.event_id, progress=progress)
