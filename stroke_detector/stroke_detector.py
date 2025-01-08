import os

import imutils
import torch
import torchvision
import numpy as np
from torchvision import transforms
import torch.nn as nn
from torchvision.models import Inception_V3_Weights

from utils.video_utils import center_of_box
from utils.video_utils import get_dtype


class Identity(nn.Module):
    def __init__(self):
        super(Identity, self).__init__()

    def forward(self, x):
        return x


class FeatureExtractor(nn.Module):
    def __init__(self):
        super().__init__()
        self.feature_extractor = torchvision.models.inception_v3(weights=Inception_V3_Weights.IMAGENET1K_V1)
        self.feature_extractor.fc = Identity()

    def forward(self, x):
        output = self.feature_extractor(x)
        return output


class LSTM_model(nn.Module):
    """
    Time sequence model for stroke classifying
    """

    def __init__(self, num_classes, input_size=2048, num_layers=3, hidden_size=90, dtype=torch.cuda.FloatTensor):
        super().__init__()
        self.dtype = dtype
        self.input_size = input_size
        self.num_layers = num_layers
        self.hidden_size = hidden_size
        self.LSTM = nn.LSTM(input_size, hidden_size, num_layers, bias=True, batch_first=True)
        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        # x shape is (batch_size, seq_len, input_size)
        h0, c0 = self.init_state(x.size(0))
        output, (hn, cn) = self.LSTM(x, (h0, c0))
        # size = 1
        size = x.size(1) // 4

        output = output[:, -size:, :]
        scores = self.fc(output.squeeze(0))
        # scores shape is (batch_size, num_classes)
        return scores

    def init_state(self, batch_size):
        return (torch.zeros(self.num_layers, batch_size, self.hidden_size).type(self.dtype),
                torch.zeros(self.num_layers, batch_size, self.hidden_size).type(self.dtype))


class StrokeDetector:
    """
    Stroke detector model
    """

    def __init__(self, device='cuda', max_seq_len=55):
        self.device = device
        self.dtype = get_dtype()
        self.feature_extractor = FeatureExtractor()
        self.feature_extractor.eval()
        self.feature_extractor.type(self.dtype)
        self.normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                              std=[0.229, 0.224, 0.225])
        self.max_seq_len = max_seq_len
        self.LSTM = LSTM_model(3, dtype=self.dtype)

        # Load model`s weights
        current_dir = os.path.dirname(os.path.realpath(__file__))
        path_model = os.path.join(current_dir, 'storke_classifier_weights.pth')
        saved_state = torch.load(path_model, map_location=self.device)
        self.LSTM.load_state_dict(saved_state['model_state'])
        self.LSTM.eval()
        self.LSTM.type(self.dtype)

        self.frames_features_seq = None
        self.box_margin = 150
        self.softmax = nn.Softmax(dim=1)
        self.strokes_label = ['Forehand', 'Backhand', 'Service/Smash']

    def add_frame(self, frame, player_box):
        """
        Extract frame features using feature extractor model and add the results to the frames until now
        """
        # ROI is a small box around the player
        box_center = center_of_box(player_box)
        patch = frame[int(box_center[1] - self.box_margin): int(box_center[1] + self.box_margin),
                int(box_center[0] - self.box_margin): int(box_center[0] + self.box_margin)].copy()
        patch = imutils.resize(patch, 299)
        frame_t = patch.transpose((2, 0, 1)) / 255
        frame_tensor = torch.from_numpy(frame_t).type(self.dtype)
        frame_tensor = self.normalize(frame_tensor).unsqueeze(0)

        with torch.no_grad():
            # forward pass
            features = self.feature_extractor(frame_tensor)
            features = features.unsqueeze(1)
            # Concatenate the features to previous features
            if self.frames_features_seq is None:
                self.frames_features_seq = features
            else:
                self.frames_features_seq = torch.cat([self.frames_features_seq, features], dim=1)

    def predict_saved_seq(self, clear=True):
        """
        Use saved sequence and predict the stroke
        """
        with torch.no_grad():
            scores = self.LSTM(self.frames_features_seq)[-1].unsqueeze(0)
            probs = self.softmax(scores).squeeze().cpu().numpy()

        if clear:
            self.frames_features_seq = None

        return probs, self.strokes_label[np.argmax(probs)]
