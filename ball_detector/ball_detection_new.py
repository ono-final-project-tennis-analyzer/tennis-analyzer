import os
import numpy as np
import cv2
import torch
from PIL import Image, ImageDraw
import matplotlib.pyplot as plt

from ball_detector.ball_tracker_net import BallTrackerNetNew
from utils.video_utils import center_of_box


def combine_three_frames(frame1, frame2, frame3, width, height):
    """
    Combine three frames into one input tensor for detecting the ball
    """

    # Resize and type converting for each frame
    img = cv2.resize(frame1, (width, height))
    # input must be float type
    img = img.astype(np.float32)

    # resize it
    img1 = cv2.resize(frame2, (width, height))
    # input must be float type
    img1 = img1.astype(np.float32)

    # resize it
    img2 = cv2.resize(frame3, (width, height))
    # input must be float type
    img2 = img2.astype(np.float32)

    # combine three imgs to  (width , height, rgb*3)
    imgs = np.concatenate((img, img1, img2), axis=2)

    # since the odering of TrackNet  is 'channels_first', so we need to change the axis
    imgs = np.rollaxis(imgs, 2, 0)
    return np.array(imgs)


class BallDetector:
    """
    Ball Detector model responsible for receiving the frames and detecting the ball
    """

    def __init__(self, device='cuda', out_channels=2):
        self.device = device

        # Load TrackNet model weights
        self.detector = BallTrackerNetNew(out_channels=out_channels)

        current_dir = os.path.dirname(os.path.realpath(__file__))
        path_model = os.path.join(current_dir, 'tracknet_weights_2_classes.pth')

        self.detector.load_state_dict(torch.load(path_model, map_location=device)['model_state'])
        self.detector.eval().to(self.device)

        self.current_frame = None
        self.last_frame = None
        self.before_last_frame = None

        self.video_width = None
        self.video_height = None
        self.model_input_width = 640
        self.model_input_height = 360

        self.threshold_dist = 100
        self.xy_coordinates = np.array([[None, None], [None, None]])

        self.bounces_indices = []

    def detect_ball(self, frame):
        """
        After receiving 3 consecutive frames, the ball will be detected using TrackNet model
        :param frame: current frame
        """
        # Save frame dimensions
        if self.video_width is None:
            self.video_width = frame.shape[1]
            self.video_height = frame.shape[0]
        self.last_frame = self.before_last_frame
        self.before_last_frame = self.current_frame
        self.current_frame = frame.copy()

        # detect only in 3 frames were given
        if self.last_frame is not None:
            # combine the frames into 1 input tensor
            frames = combine_three_frames(self.current_frame, self.before_last_frame, self.last_frame,
                                          self.model_input_width, self.model_input_height)
            frames = (torch.from_numpy(frames) / 255).to(self.device)
            # Inference (forward pass)
            x, y = self.detector.inference(frames)
            if x is not None:
                # Rescale the indices to fit frame dimensions
                x = x * (self.video_width / self.model_input_width)
                y = y * (self.video_height / self.model_input_height)

                # Check distance from previous location and remove outliers
                if self.xy_coordinates[-1][0] is not None:
                    if np.linalg.norm(np.array([x, y]) - self.xy_coordinates[-1]) > self.threshold_dist:
                        x, y = None, None
            self.xy_coordinates = np.append(self.xy_coordinates, np.array([[x, y]]), axis=0)

    def mark_positions(self, frame, mark_num=4, frame_num=None, ball_color='yellow'):
        """
        Mark the last 'mark_num' positions of the ball in the frame
        :param frame: the frame we mark the positions in
        :param mark_num: number of previous detection to mark
        :param frame_num: current frame number
        :param ball_color: color of the marks
        :return: the frame with the ball annotations
        """
        bounce_i = None
        # if frame number is not given, use the last positions found
        if frame_num is not None:
            q = self.xy_coordinates[frame_num - mark_num + 1:frame_num + 1, :]
            for i in range(frame_num - mark_num + 1, frame_num + 1):
                if i in self.bounces_indices:
                    bounce_i = i - frame_num + mark_num - 1
                    break
        else:
            q = self.xy_coordinates[-mark_num:, :]
        pil_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(pil_image)
        # Mark each position by a circle
        for i in range(q.shape[0]):
            if q[i, 0] is not None:
                draw_x = q[i, 0]
                draw_y = q[i, 1]
                bbox = (draw_x - 2, draw_y - 2, draw_x + 2, draw_y + 2)
                draw = ImageDraw.Draw(pil_image)
                if bounce_i is not None and i == bounce_i:
                    draw.ellipse(bbox, outline='red')
                else:
                    draw.ellipse(bbox, outline=ball_color)

            # Convert PIL image format back to opencv image format
            frame = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        return frame

    def show_y_graph(self, player_1_boxes, player_2_boxes):
        """
        Display ball y index positions and both players y index positions in all the frames in a graph
        :param player_1_boxes: bottom player boxes
        :param player_2_boxes: top player boxes
        """
        player_1_centers = np.array([center_of_box(box) for box in player_1_boxes])
        player_1_y_values = player_1_centers[:, 1]
        # get y value of top quarter of bottom player box
        player_1_y_values -= np.array([(box[3] - box[1]) // 4 for box in player_1_boxes])

        # Calculate top player boxes center
        player_2_centers = []
        for box in player_2_boxes:
            if box[0] is not None:
                player_2_centers.append(center_of_box(box))
            else:
                player_2_centers.append([None, None])
        player_2_centers = np.array(player_2_centers)
        player_2_y_values = player_2_centers[:, 1]

        y_values = self.xy_coordinates[:, 1].copy()
        x_values = self.xy_coordinates[:, 0].copy()

        plt.figure()
        plt.scatter(range(len(y_values)), y_values)
        plt.plot(range(len(player_1_y_values)), player_1_y_values, color='r')
        plt.plot(range(len(player_2_y_values)), player_2_y_values, color='g')
        plt.show()