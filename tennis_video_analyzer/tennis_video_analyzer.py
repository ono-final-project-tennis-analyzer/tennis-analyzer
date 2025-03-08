import argparse
import cv2
import torch
import os

from ball_detector.ball_detection_new import BallDetector
from db.models import with_session
from court_detector.court_detection_computer_vision import CourtDetectorComputerVision
from db.stores.events_store import EventStore
from db.stores.video_events_store import VideoEventsStore
from player_detector.player_detection import PlayerDetector
from player_pose_extractor.player_pose_extractor import PlayerPoseExtractor
from player_pose_extractor.smoothing import Smooth
from storage_client import StorageClient
from stroke_detector.stroke_detection_utils import find_strokes_indices
from stroke_detector.stroke_detector import StrokeDetector
from utils.video_utils import get_video_properties, get_dtype, frame_to_time, frames_to_times

try:
    from video_analyzer_progress_tracker import VideoAnalyzerProgressTracker
except Exception as e:
    from tennis_video_analyzer.video_analyzer_progress_tracker import VideoAnalyzerProgressTracker

device = 'cuda' if torch.cuda.is_available() else 'cpu'


def download_video_to_process(event_id, session):
    """
    Download the video from MinIO storage for processing
    
    Args:
        event_id (int): The ID of the event
        session: Database session
        
    Returns:
        str: The path to the downloaded video file
    """
    event_store = EventStore(session=session)
    storage_client = StorageClient()
    event = event_store.get_event(event_id)

    if not event or not event.meta or "file_name" not in event.meta:
        raise ValueError(f"Event {event_id} not found or missing file_name in metadata")

    print(f'Downloading video for event {event_id}, file name - {event.meta["file_name"]}')

    # Create the video directory if it doesn't exist
    os.makedirs("video", exist_ok=True)
    
    # Download the file from MinIO
    local_path = f'./video/input_{event_id}.mp4'
    result = storage_client.download_file(event.account_id, event.meta['file_name'], local_path)
    
    if "failed" in result.lower():
        raise Exception(f"Failed to download video: {result}")
        
    print(f"Video downloaded successfully to {local_path}")
    return local_path


def upload_processed_video(event_id, video_id, output_path, session):
    """
    Upload the processed video to MinIO storage and update the video status in the database
    
    Args:
        event_id (int): The ID of the event (for getting account_id)
        video_id (int): The ID of the video
        output_path (str): The path to the processed video
        session: Database session
    """
    event_store = EventStore(session=session)
    
    # Update video status in the database
    from db.stores.videos_store import VideosStore
    videos_store = VideosStore(session)
    
    # Get the event to get the account_id
    event = event_store.get_event(event_id)
    if not event or not event.meta or "file_name" not in event.meta:
        raise ValueError(f"Event {event_id} not found or missing file_name in metadata")
    
    # Upload the processed video to MinIO
    storage_client = StorageClient()
    upload_file_name = f'processed_{event.meta["file_name"]}'
    
    print(f'Uploading processed video for event {event_id}, video {video_id}, file name - {upload_file_name}')
    
    # Check if the output file exists
    if not os.path.exists(output_path):
        raise FileNotFoundError(f"Processed video file not found: {output_path}")
    
    # Upload the file to MinIO
    result = storage_client.upload_file(event.account_id, output_path, upload_file_name)
    
    # Update the video record with the processed video path
    minio_path = f"{result.account_id}/{upload_file_name}"
    videos_store.update_video_status(video_id, status=2, processed_video_path=minio_path)
    
    print(f"Processed video uploaded successfully to MinIO: {minio_path}")


def normalize_ball_bounce_position(ball_coordinates, frame, court_detector):
    """
    Normalize the position of a ball bounce within the court coordinates
    
    Args:
        ball_coordinates (list): List of ball coordinates (x, y) for each frame
        frame (int): The frame number of the bounce
        court_detector: Court detector object with court dimensions
        
    Returns:
        dict: Metadata containing normalized position (-1 to 1) and raw position
    """
    # Default metadata
    metadata = {}
    
    # Convert frame to int if it's a NumPy type
    frame = int(frame) if hasattr(frame, 'item') else int(frame)
    
    # Debug information
    print(f"Normalizing ball bounce position for frame {frame}")
    print(f"Ball coordinates available: {ball_coordinates is not None}")
    print(f"Court detector available: {court_detector is not None}")
    
    # Check if court detector has the necessary attributes
    has_court_lines = (hasattr(court_detector, 'baseline_top') and 
                      hasattr(court_detector, 'baseline_bottom') and
                      hasattr(court_detector, 'left_court_line') and
                      hasattr(court_detector, 'right_court_line'))
    
    print(f"Court lines available: {has_court_lines}")
    
    # Add normalized position if ball coordinates and court detector are available
    if (ball_coordinates is not None and 
        court_detector is not None and 
        has_court_lines and
        frame < len(ball_coordinates)):
        
        try:
            # Get ball coordinates for the frame
            x, y = ball_coordinates[frame]
            
            # Debug information
            print(f"Ball coordinates at frame {frame}: x={x}, y={y}")
            
            # Convert NumPy types to standard Python types
            if hasattr(x, 'item'):
                x = float(x.item())
            else:
                x = float(x)
                
            if hasattr(y, 'item'):
                y = float(y.item())
            else:
                y = float(y)
            
            # Get court lines
            baseline_top = court_detector.baseline_top
            baseline_bottom = court_detector.baseline_bottom
            left_court_line = court_detector.left_court_line
            right_court_line = court_detector.right_court_line
            
            # Debug information
            print(f"Court lines: baseline_top={baseline_top}, baseline_bottom={baseline_bottom}, left_court_line={left_court_line}, right_court_line={right_court_line}")
            
            # Check if all court lines are available
            if (baseline_top is not None and 
                baseline_bottom is not None and 
                left_court_line is not None and 
                right_court_line is not None):
                
                # Get court corners
                court_top_left = [left_court_line[0], baseline_top[1]]
                court_top_right = [right_court_line[0], baseline_top[1]]
                court_bottom_left = [left_court_line[2], baseline_bottom[1]]
                court_bottom_right = [right_court_line[2], baseline_bottom[1]]
                
                # Debug information
                print(f"Court corners: top_left={court_top_left}, top_right={court_top_right}, bottom_left={court_bottom_left}, bottom_right={court_bottom_right}")
                
                # Convert court coordinates to standard Python types if they're NumPy types
                try:
                    court_top_left = [float(val.item()) if hasattr(val, 'item') else float(val) for val in court_top_left]
                    court_top_right = [float(val.item()) if hasattr(val, 'item') else float(val) for val in court_top_right]
                    court_bottom_left = [float(val.item()) if hasattr(val, 'item') else float(val) for val in court_bottom_left]
                    court_bottom_right = [float(val.item()) if hasattr(val, 'item') else float(val) for val in court_bottom_right]
                    
                    # Calculate court width and height
                    court_width = max(
                        abs(court_top_right[0] - court_top_left[0]),
                        abs(court_bottom_right[0] - court_bottom_left[0])
                    )
                    court_height = max(
                        abs(court_bottom_left[1] - court_top_left[1]),
                        abs(court_bottom_right[1] - court_top_right[1])
                    )
                    
                    # Debug information
                    print(f"Court dimensions: width={court_width}, height={court_height}")
                    
                    # Calculate normalized position (-1 to 1)
                    if court_width > 0 and court_height > 0:
                        # Calculate center of court
                        court_center_x = (court_top_left[0] + court_top_right[0] + court_bottom_left[0] + court_bottom_right[0]) / 4
                        court_center_y = (court_top_left[1] + court_top_right[1] + court_bottom_left[1] + court_bottom_right[1]) / 4
                        
                        # Normalize position
                        norm_x = 2 * (x - court_center_x) / court_width  # -1 (left) to 1 (right)
                        norm_y = 2 * (y - court_center_y) / court_height  # -1 (top) to 1 (bottom)
                        
                        # Debug information
                        print(f"Normalized position: x={norm_x}, y={norm_y}")
                        
                        metadata = {
                            'position': {
                                'x': float(norm_x),
                                'y': float(norm_y)
                            },
                            'raw_position': {
                                'x': float(x),
                                'y': float(y)
                            }
                        }
                except Exception as e:
                    print(f"Error converting court coordinates: {str(e)}")
                    # Fallback to just storing the raw position
                    metadata = {
                        'raw_position': {
                            'x': float(x),
                            'y': float(y)
                        }
                    }
            else:
                # If court corners are not available, just store the raw position
                print("Court lines not available, storing only raw position")
                metadata = {
                    'raw_position': {
                        'x': float(x),
                        'y': float(y)
                    }
                }
        except Exception as e:
            print(f"Error normalizing ball bounce position for frame {frame}: {str(e)}")
    else:
        print(f"Cannot normalize ball bounce position for frame {frame}: missing data")
        if ball_coordinates is None:
            print("Ball coordinates are None")
        elif frame >= len(ball_coordinates):
            print(f"Frame {frame} is out of bounds for ball coordinates (length: {len(ball_coordinates)})")
        elif court_detector is None:
            print("Court detector is None")
        elif not has_court_lines:
            print("Court detector does not have the necessary court line attributes")
    
    return metadata


def save_video_events(session, event_id, video_id, bottom_player_strokes_indices, top_player_strokes_indices, bounces_indices, fps, ball_coordinates=None, court_detector=None):
    """
    Save the detected events to the database
    
    Args:
        session: Database session
        event_id (int): The ID of the event (for logging purposes)
        video_id (int): The ID of the video to associate events with
        bottom_player_strokes_indices (list): List of frame indices for bottom player strokes
        top_player_strokes_indices (list): List of frame indices for top player strokes
        bounces_indices (list): List of frame indices for ball bounces
        fps (float): Frames per second of the video
        ball_coordinates (list): List of ball coordinates (x, y) for each frame
        court_detector: Court detector object with court dimensions
    """
    if not video_id:
        print("No video ID provided, skipping saving events to database")
        return
    
    # Convert fps to standard Python float if it's a NumPy type
    if hasattr(fps, 'item'):
        fps = float(fps.item())
    else:
        fps = float(fps)
    
    video_events_store = VideoEventsStore(session)
    
    try:
        # Delete any existing events for this video_id
        video_events_store.delete_video_events_by_video_id(video_id)
        
        # Save bottom player strokes
        for frame in bottom_player_strokes_indices:
            try:
                # Convert NumPy types to standard Python types
                frame_number = int(frame) if hasattr(frame, 'item') else int(frame)
                time_seconds = float(frame_number) / fps
                time_string = frame_to_time(frame_number, fps)
                
                video_events_store.create_video_event(
                    video_id=video_id,
                    event_type='bottom_player_stroke',
                    frame_number=frame_number,
                    time_seconds=time_seconds,
                    time_string=time_string,
                    event_metadata={}
                )
            except Exception as e:
                print(f"Error saving bottom player stroke event for frame {frame}: {str(e)}")
        
        # Save top player strokes
        for frame in top_player_strokes_indices:
            try:
                # Convert NumPy types to standard Python types
                frame_number = int(frame) if hasattr(frame, 'item') else int(frame)
                time_seconds = float(frame_number) / fps
                time_string = frame_to_time(frame_number, fps)
                
                video_events_store.create_video_event(
                    video_id=video_id,
                    event_type='top_player_stroke',
                    frame_number=frame_number,
                    time_seconds=time_seconds,
                    time_string=time_string,
                    event_metadata={}
                )
            except Exception as e:
                print(f"Error saving top player stroke event for frame {frame}: {str(e)}")
        
        # Save ball bounces with normalized position
        for frame in bounces_indices:
            try:
                # Convert NumPy types to standard Python types
                frame_number = int(frame) if hasattr(frame, 'item') else int(frame)
                time_seconds = float(frame_number) / fps
                time_string = frame_to_time(frame_number, fps)
                
                # Get normalized position metadata
                metadata = normalize_ball_bounce_position(ball_coordinates, frame_number, court_detector)
                
                # Print the metadata to debug
                print(f"Ball bounce metadata for frame {frame_number}: {metadata}")
                
                video_events_store.create_video_event(
                    video_id=video_id,
                    event_type='ball_bounce',
                    frame_number=frame_number,
                    time_seconds=time_seconds,
                    time_string=time_string,
                    event_metadata=metadata
                )
            except Exception as e:
                print(f"Error saving ball bounce event for frame {frame}: {str(e)}")
        
        print(f"Saved {len(bottom_player_strokes_indices) + len(top_player_strokes_indices) + len(bounces_indices)} events to database for video ID {video_id} (event ID {event_id})")
    except Exception as e:
        print(f"Error saving video events: {str(e)}")
        # Rollback the session to avoid leaving it in a bad state
        session.rollback()
        raise


def process_video(event_id=0, video_path=None, output_path="video/test.output.mp4", draw_ball_trace=False,
                  ball_trace_length=7):
    video_id = None
    with with_session() as session:
        try:
            # Initialize progress tracker
            progress_tracker = VideoAnalyzerProgressTracker(session, total_frames=100, event_id=event_id)
            
            # Get video ID if event_id is provided
            if event_id:
                from db.stores.videos_store import VideosStore
                videos_store = VideosStore(session)
                videos = videos_store.get_videos_by_event_id(event_id)
                if videos:
                    video_id = videos[0].id
                    # Update video status to 'processing'
                    videos_store.update_video_status(video_id, status=1)
                    print(f"Processing video ID {video_id} for event ID {event_id}")
                    
                    # If no video_path is provided, we'll download from MinIO later
                    if not video_path:
                        print("No local video path provided, will download from MinIO")
                else:
                    print(f"No videos found for event ID {event_id}")

            # Stage 1: Downloading the video
            progress_tracker.update_progress(0, stage="Downloading Video")
            
            # If video_path is provided, check if it exists locally
            if video_path and os.path.exists(video_path):
                print(f"Using provided local video file: {video_path}")
            else:
                # If no video_path or it doesn't exist, download from MinIO
                if event_id:
                    try:
                        video_path = download_video_to_process(event_id, session)
                        print(f"Downloaded video from MinIO: {video_path}")
                    except Exception as e:
                        print(f"Error downloading video: {str(e)}")
                        raise
                else:
                    raise ValueError("No video path provided and no event ID to download from")
            
            # Check if the video file exists
            if not os.path.exists(video_path):
                raise FileNotFoundError(f"Video file not found: {video_path}")
                
            progress_tracker.update_progress(100, stage="Downloading Video")

            # Stage 2: Init models
            progress_tracker.update_progress(0, stage="Initializing Models")
            court_detector = CourtDetectorComputerVision(verbose=False)
            player_detector = PlayerDetector(device)
            ball_detector = BallDetector(device)
            pose_extractor_bottom_player = PlayerPoseExtractor(person_num=1, box=False, dtype=get_dtype())
            pose_extractor_top_player = PlayerPoseExtractor(person_num=1, box=False, dtype=get_dtype())
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

            print(f'bottom_player_strokes_indices: {bottom_player_strokes_indices}, top_player_strokes_indices: {top_player_strokes_indices}, bounces_indices: {bounces_indices}')
            
            # Convert frame indices to time values
            print("\nTime values for detected events:")
            print("Bottom player strokes:")
            for frame in bottom_player_strokes_indices:
                time_str = frame_to_time(frame, fps)
                print(f"  Frame {frame} -> {time_str}")
                
            print("Top player strokes:")
            for frame in top_player_strokes_indices:
                time_str = frame_to_time(frame, fps)
                print(f"  Frame {frame} -> {time_str}")
                
            print("Ball bounces:")
            for frame in bounces_indices:
                time_str = frame_to_time(frame, fps)
                print(f"  Frame {frame} -> {time_str}")
                
            # Using the frames_to_times function to get a dictionary of time values
            events_dict = {
                "bottom_player_strokes": bottom_player_strokes_indices,
                "top_player_strokes": top_player_strokes_indices,
                "ball_bounces": bounces_indices
            }
            
            time_values_dict = frames_to_times(events_dict, fps)
            print("\nEvents dictionary with time values:")
            for event_name, time_values in time_values_dict.items():
                print(f"{event_name}: {time_values}")
                
            # Stage 4: Uploading Processed Video
            if event_id and video_id:
                progress_tracker.update_progress(0, stage="Uploading Video")
                upload_processed_video(event_id, video_id, output_path, session)
                
                # Save events to database
                save_video_events(
                    session, 
                    event_id, 
                    video_id,
                    bottom_player_strokes_indices, 
                    top_player_strokes_indices, 
                    bounces_indices, 
                    fps,
                    ball_detector.xy_coordinates,
                    court_detector
                )
                progress_tracker.update_progress(100, stage="Uploading Video")
            elif event_id:
                print(f"No videos found for event ID {event_id}, skipping upload and event saving")

            print('Processing completed')
            print(f'New video created, file name - {output_path}')
            
        except Exception as e:
            print(f"Error processing video: {str(e)}")
            # Update video status to 'error' if something went wrong
            if event_id and video_id:
                from db.stores.videos_store import VideosStore
                videos_store = VideosStore(session)
                videos_store.update_video_status(video_id, status=3)
            raise  # Re-raise the exception for further handling


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Tennis Video Analyzer')
    parser.add_argument('--video_path', type=str, help='Path to the video file (local file to upload)')
    parser.add_argument('--video_out_path', type=str, default='video/test.output.mp4', help='Path to the output video file')
    parser.add_argument('--event_id', type=int, default=0, help='Event ID for database operations')
    parser.add_argument('--draw_ball_trace', action='store_true', help='Draw ball trace on the output video')
    parser.add_argument('--ball_trace_length', type=int, default=7, help='Length of the ball trace')
    parser.add_argument('--create_test_data', action='store_true', help='Create test event and video data')
    args = parser.parse_args()

    # Create test data if requested
    if args.create_test_data:
        with with_session() as session:
            # Create a test event
            event_store = EventStore(session)
            
            # Check if we have a local video file to upload
            local_video_path = args.video_path
            if not local_video_path or not os.path.exists(local_video_path):
                print("Warning: No valid local video file provided for upload. Using default test data.")
                file_name = "input.mp4"
            else:
                # Use the filename from the provided path
                file_name = os.path.basename(local_video_path)
            
            # Create the event with the file name in metadata
            created_event = event_store.create_event("test_tennis_analysis", "1", {
                "account_id": "1",
                "file_name": file_name,
            })
            
            # Upload the video to MinIO if a local file was provided
            if local_video_path and os.path.exists(local_video_path):
                storage_client = StorageClient()
                try:
                    result = storage_client.upload_file("1", local_video_path, file_name)
                    print(f"Uploaded video to MinIO: {result.object_name}")
                except Exception as e:
                    print(f"Failed to upload video to MinIO: {str(e)}")
                    print("Continuing with test data creation...")
            
            # Create a test video record
            from db.stores.videos_store import VideosStore
            from datetime import datetime
            videos_store = VideosStore(session)
            video = videos_store.create_video(
                event_id=created_event.id,
                account_id="1",
                video_path=f"1/{file_name}",  # MinIO path format: account_id/file_name
                name=f"Test Tennis Video - {file_name}",
                upload_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                status=0
            )
            
            print(f"Created test event with ID {created_event.id} and video with ID {video.id}")
            
            # Use the created event ID if no event ID was provided
            if args.event_id == 0:
                args.event_id = created_event.id
                print(f"Using created event ID: {args.event_id}")

    # Process the video
    try:
        process_video(
            event_id=args.event_id,
            video_path=args.video_path,
            output_path=args.video_out_path,
            draw_ball_trace=args.draw_ball_trace,
            ball_trace_length=args.ball_trace_length
        )
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        import traceback
        traceback.print_exc()
