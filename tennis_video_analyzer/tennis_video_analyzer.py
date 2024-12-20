import argparse
import cv2
import time
import torch
from db.models import with_session
from ball_detector.ball_tracker import BallTracker
from court_detector.court_detection_computer_vision import CourtDetectorComputerVision
from db.stores.events_store import EventStore
from db.stores.video_store import VideoStore
from player_detector.player_detection import PlayerDetector
from storage_client import StorageClient
from utils.video_utils import get_video_properties

try:
    from video_analyzer_progress_tracker import VideoAnalyzerProgressTracker
except Exception as e:
    from tennis_video_analyzer.video_analyzer_progress_tracker import VideoAnalyzerProgressTracker

device = 'cuda' if torch.cuda.is_available() else 'cpu'


def download_video_to_process(event_id, session):
    event_store = EventStore(session=session)
    storage_client = StorageClient()
    event = event_store.get_event(event_id)

    print(f'Downloading video for event {event_id}, file name - {event.meta["file_name"]}')

    storage_client.download_file(event.account_id, event.meta['file_name'], './video/input.mp4')
    return 'video/input.mp4'


def upload_processed_video(event_id, output_path, session):
    event_store = EventStore(session=session)

    storage_client = StorageClient()
    event = event_store.get_event(event_id)
    upload_file_name = 'output-' + event.meta['file_name']

    print(f'Uploading processed video for event {event_id}, file name - {event.meta["file_name"]}')
    storage_client.upload_file(event.account_id, output_path, upload_file_name)


def process_video(event_id=0, video_path=None, output_path="video/test.output.mp4", draw_ball_trace=False,
                  ball_trace_length=7):
    with with_session() as session:
        # Initialize progress tracker
        progress_tracker = VideoAnalyzerProgressTracker(session, total_frames=100, event_id=event_id)

        # Stage 1: Downloading the video
        progress_tracker.update_progress(0, stage="downloading")
        if not video_path:
            video_path = download_video_to_process(event_id, session)
        progress_tracker.update_progress(100, stage="downloading")

        # Stage 2: Detecting Court
        progress_tracker.update_progress(0, stage="detecting_court")
        court_detector = CourtDetectorComputerVision(verbose=False)
        player_detector = PlayerDetector(device)
        ball_tracker = BallTracker(device)
        progress_tracker.update_progress(100, stage="detecting_court")

        # Stage 3: Tracking the Ball
        progress_tracker.update_progress(0, stage="tracking_ball")
        video = cv2.VideoCapture(video_path)
        ball_track = ball_tracker.infer_model(
            video,
            progress_tracker=progress_tracker,
            stage="tracking_ball",
            start_progress=0,
            weight=50  # Tracking the ball is 50% of progress
        )
        progress_tracker.update_progress(100, stage="tracking_ball")

        # Stage 4: Processing Frames
        progress_tracker.update_progress(0, stage="processing_frames")
        fps, length, width, height = get_video_properties(video)
        fourcc = cv2.VideoWriter.fourcc(*'mp4v')
        out_video = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        video.set(cv2.CAP_PROP_POS_FRAMES, 0)

        frame_counter = 0
        need_court_detection = True
        court_detection_done = False

        while True:
            ret, frame = video.read()
            if not ret:
                break

            frame_counter += 1

            # Update progress for frame processing
            progress_tracker.update_progress(
                frame_counter, length, stage="processing_frames"
            )

            if frame_counter == 1 or need_court_detection:
                try:
                    court_detector.detect_court(frame)
                    need_court_detection = False
                    court_detection_done = True
                except Exception as e:
                    print(f'Court detection failed on frame {frame_counter} with error: {e}')
                    need_court_detection = True
                    court_detection_done = False

            if court_detection_done:
                try:
                    court_detector.track_court(frame)
                except Exception:
                    need_court_detection = True

            clone_frame = frame.copy()

            if court_detector.success_flag:
                try:
                    clone_frame = court_detector.add_court_overlay(clone_frame)
                except Exception:
                    need_court_detection = True

                try:
                    player_detector.detect_top_and_bottom_players(clone_frame,
                                                                  court_detector.court_warp_matrix[-1])
                    clone_frame = player_detector.draw_player_boxes_over_frame(clone_frame)
                except Exception:
                    pass

                try:
                    if ball_track[frame_counter][0]:
                        if draw_ball_trace:
                            for j in range(ball_trace_length):
                                idx = frame_counter - j
                                if idx >= 0 and ball_track[idx][0]:
                                    draw_x = int(ball_track[idx][0])
                                    draw_y = int(ball_track[idx][1])
                                    clone_frame = cv2.circle(clone_frame, (draw_x, draw_y),
                                                             radius=3, color=(0, 255, 0), thickness=2)
                        else:
                            draw_x = int(ball_track[frame_counter][0])
                            draw_y = int(ball_track[frame_counter][1])
                            clone_frame = cv2.circle(clone_frame, (draw_x, draw_y),
                                                     radius=5, color=(0, 255, 0), thickness=2)
                            clone_frame = cv2.putText(clone_frame, 'ball',
                                                      org=(draw_x + 8, draw_y + 8),
                                                      fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                                                      fontScale=0.8,
                                                      thickness=2,
                                                      color=(0, 255, 0))
                except Exception:
                    pass

            out_video.write(clone_frame)

        video.release()
        out_video.release()
        cv2.destroyAllWindows()
        progress_tracker.update_progress(100, stage="processing_frames")

        # Stage 5: Uploading Processed Video
        progress_tracker.update_progress(0, stage="uploading")
        upload_processed_video(event_id, output_path, session)
        progress_tracker.update_progress(100, stage="uploading")

        print('Processing completed')
        print(f'New video created, file name - {output_path}')


# if __name__ == '__main__':
#     parser = argparse.ArgumentParser()
#     parser.add_argument('--video_path', type=str, help='path to input video', default="video/test_short.mp4")
#     parser.add_argument('--video_out_path', type=str, help='path to output video', default="video/test.output.mp4")
#     args = parser.parse_args()
#
#     with with_session() as session:
#         store = EventStore(session)
#         created_event = store.create_event("read_task_test", "1", {
#             "account_id": "1",
#             "fileName": "input.mp4",
#         })
#
#         upload_processed_video(event_id=created_event.id, output_path="video/input.mp4", session=session)
