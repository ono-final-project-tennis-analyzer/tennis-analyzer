import argparse
import cv2
import torch

from ball_detector.ball_detection_new import BallDetector
from db.models import with_session
from court_detector.court_detection_computer_vision import CourtDetectorComputerVision
from db.stores.events_store import EventStore
from player_detector.player_detection import PlayerDetector
from player_pose_extractor.player_pose_extractor import PlayerPoseExtractor
from player_pose_extractor.smoothing import Smooth
from storage_client import StorageClient
from stroke_detector.stroke_detection_utils import find_strokes_indices, get_stroke_predictions
from stroke_detector.stroke_detector import StrokeDetector
from utils.video_utils import get_video_properties, get_dtype

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
        progress_tracker.update_progress(0, stage="Downloading Video")
        if not video_path:
            video_path = download_video_to_process(event_id, session)
        progress_tracker.update_progress(100, stage="Downloading Video")

        # Stage 2: Init models
        progress_tracker.update_progress(0, stage="Initializing Models")
        court_detector = CourtDetectorComputerVision(verbose=False)
        player_detector = PlayerDetector(device)
        ball_detector = BallDetector(device)
        pose_extractor_bottom_player = PlayerPoseExtractor(person_num=1, box=False, dtype=get_dtype())
        pose_extractor_top_player = PlayerPoseExtractor(person_num=1, box=False, dtype=get_dtype())
        stroke_detector_bottom_player = StrokeDetector(device)
        stroke_detector_top_player = StrokeDetector(device)
        progress_tracker.update_progress(100, stage="Initializing Models")

        # Stage 3: Processing Frames
        video = cv2.VideoCapture(video_path)
        progress_tracker.update_progress(0, stage="Processing Video")
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
                frame_counter, length, stage="Processing Video"
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
                                                                  court_detector.court_warp_matrix[-1], True)
                    clone_frame = player_detector.draw_player_boxes_over_frame(clone_frame)
                except Exception:
                    print(f'Player detection failed on frame {frame_counter}')
                    pass

                try:
                    ball_detector.detect_ball(court_detector.delete_extra_parts(frame))
                except Exception:
                    print(f'Ball detection failed on frame {frame_counter}')
                    pass

                try:
                    pose_extractor_bottom_player.extract_pose(frame,
                                                              player_detector.player_bboxes_bottom_last_frame[0][0])
                    pose_extractor_top_player.extract_pose(frame, player_detector.player_bboxes_top_last_frame[0][0])
                except Exception:
                    pass

            out_video.write(clone_frame)

        video.release()
        out_video.release()
        cv2.destroyAllWindows()

        df_bottom = pose_extractor_bottom_player.save_to_csv('video', player_id=1)
        smoother = Smooth()
        df_smooth_bottom = smoother.smooth(df_bottom)
        smoother.save_to_csv('video', player_id=1)

        bottom_player_strokes_indices, top_player_strokes_indices, bounces_indices = find_strokes_indices(
            player_detector.bottom_player_boxes,
            player_detector.top_player_boxes,
            ball_detector.xy_coordinates,
            df_smooth_bottom)

        bottom_player_strokes = get_stroke_predictions(video_path, stroke_detector_bottom_player,
                                                       bottom_player_strokes_indices,
                                                       player_detector.bottom_player_boxes)

        progress_tracker.update_progress(100, stage="Processing Video")

        # Stage 4: Uploading Processed Video
        if event_id:
            progress_tracker.update_progress(0, stage="Uploading Video")
            upload_processed_video(event_id, output_path, session)
            progress_tracker.update_progress(100, stage="Uploading Video")

        print('Processing completed')
        print(f'New video created, file name - {output_path}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--video_path', type=str, help='path to input video', default="video/test-short.mp4")
    parser.add_argument('--video_out_path', type=str, help='path to output video', default="video/test.output.mp4")
    args = parser.parse_args()

    # with with_session() as session:
    #     store = EventStore(session)
    #     created_event = store.create_event("read_task_test", "1", {
    #         "account_id": "1",
    #         "fileName": "input.mp4",
    #     })
    #
    #     upload_processed_video(event_id=created_event.id, output_path="video/input.mp4", session=session)
    # test process video
    process_video(video_path=args.video_path, output_path=args.video_out_path)
