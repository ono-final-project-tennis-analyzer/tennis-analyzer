import argparse
import cv2
import time
import torch

from ball_detector.ball_tracker import BallTracker
from court_detector.court_detection_computer_vision import CourtDetectorComputerVision
from player_detector.player_detection import PlayerDetector
from utils.video_utils import get_video_properties

device = 'cuda' if torch.cuda.is_available() else 'cpu'


def process_video(video_path, output_path):
    court_detector = CourtDetectorComputerVision(verbose=False)
    player_detector = PlayerDetector(device)
    ball_tracker = BallTracker(device)

    video = cv2.VideoCapture(video_path)

    fps, length, width, height = get_video_properties(video)

    fourcc = cv2.VideoWriter.fourcc(*'mp4v')
    out_video = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    frame_counter = 0
    total_time = 0
    need_court_detection = True
    draw_trace = False
    trace_ball = 7

    ball_track = ball_tracker.infer_model(video)

    while True:
        start_time = time.time()
        ret, frame = video.read()

        if not ret:
            break

        frame_counter += 1

        if frame_counter == 1 or need_court_detection:
            try:
                court_detector.detect_court(frame)
                print(f'Court detection {"Success" if court_detector.success_flag else "Failed"}')
                print(f'Time to detect court :  {time.time() - start_time} seconds')
                start_time = time.time()
                need_court_detection = False
            except Exception as e:
                print(f'Court detection failed for frame {frame_counter} with error: {e}')
                court_detector.success_flag = False

        clone_frame = frame.copy()

        # Add court overlay
        if court_detector.success_flag:
            court_detector.track_court(frame)

            try:
                clone_frame = court_detector.add_court_overlay(clone_frame, overlay_color=(0, 0, 255),
                                                               frame_num=frame_counter)
            except Exception as e:
                print(f'Error adding court overlay on frame {frame_counter}: {e}')
                need_court_detection = True

            # detect players
            try:
                player_detector.detect_top_and_bottom_players(clone_frame,
                                                              court_detector.court_warp_matrix[-1],
                                                              filter_players=True)
                clone_frame = player_detector.draw_player_boxes_over_frame(clone_frame)
            except Exception as e:
                print(f'Error detecting players on frame {frame_counter}: {e}')

            # detect ball
            try:
                if ball_track[frame_counter][0]:
                    if draw_trace:
                        for j in range(0, trace_ball):
                            if frame_counter - j >= 0:
                                if ball_track[frame_counter - j][0]:
                                    draw_x = int(ball_track[frame_counter - j][0])
                                    draw_y = int(ball_track[frame_counter - j][1])
                                    clone_frame = cv2.circle(clone_frame, (draw_x, draw_y),
                                                             radius=3, color=(0, 255, 0), thickness=2)
                    else:
                        clone_frame = cv2.circle(clone_frame,
                                                 (int(ball_track[frame_counter][0]), int(ball_track[frame_counter][1])),
                                                 radius=5,
                                                 color=(0, 255, 0), thickness=2)
                        clone_frame = cv2.putText(clone_frame, 'ball',
                                                  org=(int(ball_track[frame_counter][0]) + 8,
                                                       int(ball_track[frame_counter][1]) + 8),
                                                  fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                                                  fontScale=0.8,
                                                  thickness=2,
                                                  color=(0, 255, 0))
            except Exception as e:
                print(f'Error detecting ball on frame {frame_counter}: {e}')

        # Write the frame to the output video
        out_video.write(clone_frame)

        total_time += (time.time() - start_time)
        if total_time > 0:
            print('Processing frame %d/%d  FPS %04f' % (frame_counter, length, frame_counter / total_time), '\r',
                  end='')

        if not frame_counter % 100:
            print('')

    if total_time > 0:
        print('Processing frame %d/%d  FPS %04f' % (length, length, length / total_time), '\n', end='')

    print('Processing completed')
    print(f'New video created, file name - {output_path}')

    video.release()
    out_video.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--video_path', type=str, help='path to input video', default="video/test_short.mp4")
    parser.add_argument('--video_out_path', type=str, help='path to output video', default="video/test.output.mp4")
    args = parser.parse_args()

    process_video(args.video_path, args.video_out_path)
