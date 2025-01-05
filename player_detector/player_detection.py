import torchvision
import torch
import cv2
import numpy as np
from scipy.spatial import distance
from torchvision.models.detection import FasterRCNN_ResNet50_FPN_Weights
from torchvision.models.detection import FasterRCNN_MobileNet_V3_Large_FPN_Weights
from tqdm import tqdm

from court_detector.court_reference import CourtReference


class PlayerDetector:
    def __init__(self, dtype=torch.FloatTensor):
        weights = FasterRCNN_ResNet50_FPN_Weights.COCO_V1
        self.detection_model = torchvision.models.detection.fasterrcnn_resnet50_fpn(weights=weights)

        # weights = FasterRCNN_MobileNet_V3_Large_FPN_Weights.COCO_V1
        # self.detection_model = torchvision.models.detection.fasterrcnn_mobilenet_v3_large_fpn(weights=weights)
        self.detection_model = self.detection_model.to(dtype)
        self.detection_model.eval()
        self.dtype = dtype
        self.court_ref = CourtReference()
        self.ref_top_court = self.court_ref.get_court_mask(2)
        self.ref_bottom_court = self.court_ref.get_court_mask(1)
        self.point_person_top = None
        self.point_person_bottom = None
        self.counter_top = 0
        self.counter_bottom = 0
        self.player_bboxes_top = []
        self.player_bboxes_bottom = []
        self.persons_top = []
        self.persons_bottom = []

    def detect(self, frame, person_min_score=0.85):
        PERSON_LABEL = 1
        frame_tensor = frame.transpose((2, 0, 1)) / 255
        frame_tensor = torch.from_numpy(frame_tensor).unsqueeze(0).float().to(self.dtype)

        with torch.no_grad():
            preds = self.detection_model(frame_tensor)

            persons_boxes = []
            probs = []
            for box, label, score in zip(preds[0]['boxes'][:], preds[0]['labels'], preds[0]['scores']):
                if label == PERSON_LABEL and score > person_min_score:
                    persons_boxes.append(box.detach().cpu().numpy())
                    probs.append(score.detach().cpu().numpy())
            return persons_boxes, probs

    def detect_top_and_bottom_players(self, frame, matrix, filter_players=False):
        mask_top_court = cv2.warpPerspective(self.ref_top_court, matrix, frame.shape[1::-1])
        mask_bottom_court = cv2.warpPerspective(self.ref_bottom_court, matrix, frame.shape[1::-1])
        player_bboxes_top, person_bboxes_bottom = [], []

        bboxes, probs = self.detect(frame, person_min_score=0.85)
        if len(bboxes) > 0:
            person_points = [[int((bbox[2] + bbox[0]) / 2), int(bbox[3])] for bbox in bboxes]
            person_bboxes = list(zip(bboxes, person_points))

            player_bboxes_top = [pt for pt in person_bboxes if mask_top_court[pt[1][1] - 1, pt[1][0]] == 1]
            person_bboxes_bottom = [pt for pt in person_bboxes if mask_bottom_court[pt[1][1] - 1, pt[1][0]] == 1]

            if filter_players:
                player_bboxes_top, person_bboxes_bottom = self.filter_players(player_bboxes_top, person_bboxes_bottom,
                                                                              matrix)

        self.player_bboxes_top = player_bboxes_top
        self.player_bboxes_bottom = person_bboxes_bottom
        return player_bboxes_top, person_bboxes_bottom

    def filter_players(self, person_bboxes_top, person_bboxes_bottom, matrix):
        refer_kps = np.array(self.court_ref.key_points[12:], dtype=np.float32).reshape((-1, 1, 2))
        trans_kps = cv2.perspectiveTransform(refer_kps, matrix)
        center_top_court = trans_kps[0][0]
        center_bottom_court = trans_kps[1][0]
        if len(person_bboxes_top) > 1:
            dists = [distance.euclidean(x[1], center_top_court) for x in person_bboxes_top]
            ind = dists.index(min(dists))
            person_bboxes_top = [person_bboxes_top[ind]]
        if len(person_bboxes_bottom) > 1:
            dists = [distance.euclidean(x[1], center_bottom_court) for x in person_bboxes_bottom]
            ind = dists.index(min(dists))
            person_bboxes_bottom = [person_bboxes_bottom[ind]]
        return person_bboxes_top, person_bboxes_bottom

    def track_players(self, frames, matrix_all, filter_players=False):
        min_len = min(len(frames), len(matrix_all))
        for num_frame in tqdm(range(min_len)):
            img = frames[num_frame]
            if matrix_all[num_frame] is not None:
                inv_matrix = matrix_all[num_frame]
                person_top, person_bottom = self.detect_top_and_bottom_players(img, inv_matrix, filter_players)
            else:
                person_top, person_bottom = [], []
            self.persons_top.append(person_top)
            self.persons_bottom.append(person_bottom)

    def draw_player_boxes_over_frame(self, frame):
        persons = self.player_bboxes_top + self.player_bboxes_bottom
        for j, person in enumerate(persons):
            if len(person[0]) > 0:
                player_bbox = list(person[0])
                frame = cv2.rectangle(frame, (int(player_bbox[0]), int(player_bbox[1])),
                                      (int(player_bbox[2]), int(player_bbox[3])), [255, 0, 0], 2)

        return frame
