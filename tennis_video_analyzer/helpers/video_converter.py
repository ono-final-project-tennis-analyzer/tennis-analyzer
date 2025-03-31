from moviepy import VideoFileClip


class VideoConverter:
    def __init__(self, input_path: str):
        self.input_path = input_path
        self.output_path = input_path.replace(".mp4", "_converted.mp4")

    def convert_to_h264(self) -> str:
        clip = VideoFileClip(self.input_path)
        clip.write_videofile(
            self.output_path,
            codec="libx264",
            preset="medium",
            audio_codec="aac",
            threads=4,
            ffmpeg_params=["-movflags", "faststart"]
        )
        return self.output_path
