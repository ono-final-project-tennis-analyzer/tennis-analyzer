import os

from ball_detector.tracknet import BallTrackerNet
import torch
import cv2
import numpy as np
from scipy.spatial import distance
from tqdm import tqdm


class BallTracker:
    def __init__(self, device='cuda'):
        self.model = BallTrackerNet(input_channels=9, out_channels=256)
        self.device = device

        current_dir = os.path.dirname(os.path.realpath(__file__))
        path_model = os.path.join(current_dir, 'tracknet-weights.pt')

        self.model.load_state_dict(torch.load(path_model, map_location=device))
        self.model = self.model.to(device)
        self.model.eval()
        self.width = 640
        self.height = 360
        self.frames = []
        self.ball_tracking = [(None, None)] * 2

    def prep_frames(self, video):
        """ Prepare frames for inference
        :params
            video: cv2 video object
        :return
            frames: list of frames
        """
        frames = []
        while True:
            ret, frame = video.read()
            if not ret:
                break
            frames.append(frame)

        self.frames = frames

        video.set(cv2.CAP_PROP_POS_FRAMES, 0)
        return frames

    def infer_model(self, video, progress_tracker=None, stage="analyzing", start_progress=0, weight=50):
        """
        Run the pretrained model on a consecutive list of frames.
        :param video: cv2.VideoCapture object
        :param progress_tracker: VideoAnalyzerProgressTracker instance (optional)
        :param stage: Current stage name for progress tracker
        :param start_progress: Starting progress percentage for this stage
        :param weight: Proportional weight of this stage in overall progress
        :return: List of detected ball points
        """
        frames = self.prep_frames(video)

        self.ball_tracking = [(None, None)] * 2
        prev_pred = [None, None]
        total_frames = len(frames)

        for num in tqdm(range(2, total_frames), desc="Tracking Ball"):
            img = cv2.resize(frames[num], (self.width, self.height))
            img_prev = cv2.resize(frames[num - 1], (self.width, self.height))
            img_preprev = cv2.resize(frames[num - 2], (self.width, self.height))
            imgs = np.concatenate((img, img_prev, img_preprev), axis=2)
            imgs = imgs.astype(np.float32) / 255.0
            imgs = np.rollaxis(imgs, 2, 0)
            inp = np.expand_dims(imgs, axis=0)

            out = self.model(torch.from_numpy(inp).float().to(self.device))
            output = out.argmax(dim=1).detach().cpu().numpy()
            x_pred, y_pred = self.postprocess(output, prev_pred)
            prev_pred = [x_pred, y_pred]
            self.ball_tracking.append((x_pred, y_pred))

            # Increment progress tracker
            if progress_tracker:
                current_progress = start_progress + (num / total_frames) * weight
                progress_tracker.update_progress(current_progress, stage=stage)

    def postprocess(self, feature_map, prev_pred, scale=2, max_dist=80):
        """
        :params
            feature_map: feature map with shape (1,360,640)
            prev_pred: [x,y] coordinates of ball prediction from previous frame
            scale: scale for conversion to original shape (720,1280)
            max_dist: maximum distance from previous ball detection to remove outliers
        :return
            x,y ball coordinates
        """
        feature_map *= 255
        feature_map = feature_map.reshape((self.height, self.width))
        feature_map = feature_map.astype(np.uint8)
        ret, heatmap = cv2.threshold(feature_map, 127, 255, cv2.THRESH_BINARY)
        circles = cv2.HoughCircles(heatmap, cv2.HOUGH_GRADIENT, dp=1, minDist=1, param1=50, param2=2, minRadius=2,
                                   maxRadius=7)
        x, y = None, None
        if circles is not None:
            if prev_pred[0]:
                for i in range(len(circles[0])):
                    x_temp = circles[0][i][0] * scale
                    y_temp = circles[0][i][1] * scale
                    dist = distance.euclidean((x_temp, y_temp), prev_pred)
                    if dist < max_dist:
                        x, y = x_temp, y_temp
                        break
            else:
                x = circles[0][0][0] * scale
                y = circles[0][0][1] * scale
        return x, y
