from db.stores.events_store import EventStore


class VideoAnalyzerProgressTracker:
    def __init__(self, session, total_frames, event_id=0):
        self.total_frames = total_frames
        self.current_frame = 0
        self.event_id = event_id
        self.events_store = EventStore(session=session)
        self.stage_weights = {
            "downloading": 5,
            "detecting_court": 10,
            "tracking_ball": 50,
            "processing_frames": 30,
            "uploading": 5,
        }
        self.stage_offsets = self._calculate_stage_offsets()

    def _calculate_stage_offsets(self):
        offsets = {}
        cumulative = 0
        for stage, weight in self.stage_weights.items():
            offsets[stage] = (cumulative, cumulative + weight)
            cumulative += weight
        return offsets

    def _calculate_progress(self, stage, current_value, max_value):
        offset, end = self.stage_offsets.get(stage, (0, 100))
        stage_progress = (current_value / max_value) * (end - offset)
        return offset + stage_progress

    def update_progress(self, current_value, max_value=None, stage="analyzing"):
        max_value = max_value or self.total_frames
        progress = int(self._calculate_progress(stage, current_value, max_value))

        print(f"Stage: {stage.capitalize().replace('_', ' ')}, Progress: {progress}%")

        if self.event_id:
            self.events_store.update_event(self.event_id, progress=progress, stage=stage)
