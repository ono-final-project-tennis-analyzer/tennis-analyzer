from scipy import signal
from scipy.interpolate import interp1d
from scipy.signal import find_peaks
import numpy as np

from utils.video_utils import center_of_box, get_video_properties


def find_strokes_indices(player_1_boxes, player_2_boxes, ball_positions, skeleton_df):
    """
    Detect strokes frames using location of the ball and players, and determine stroke types
    Returns strokes with their types (0 for forehand, 1 for backhand)
    """

    # Slice the x and y positions
    ball_x, ball_y = ball_positions[:, 0], ball_positions[:, 1]
    smooth_x = signal.savgol_filter(ball_x, 3, 2)
    smooth_y = signal.savgol_filter(ball_y, 3, 2)

    # Ball position interpolation
    x = np.arange(0, len(smooth_y))
    indices = [i for i, val in enumerate(smooth_y) if np.isnan(val)]
    x = np.delete(x, indices)
    y1 = np.delete(smooth_y, indices)
    y2 = np.delete(smooth_x, indices)
    ball_f2_y = interp1d(x, y1, kind='cubic', fill_value="extrapolate")
    ball_f2_x = interp1d(x, y2, kind='cubic', fill_value="extrapolate")

    player_2_centers = np.array([center_of_box(box[0]) for box in player_2_boxes])
    player_2_x, player_2_y = player_2_centers[:, 0], player_2_centers[:, 1]
    player_2_x = signal.savgol_filter(player_2_x, 3, 2)
    player_2_y = signal.savgol_filter(player_2_y, 3, 2)
    x = np.arange(0, len(player_2_y))
    indices = [i for i, val in enumerate(player_2_y) if np.isnan(val)]
    x = np.delete(x, indices)
    y1 = np.delete(player_2_y, indices)
    y2 = np.delete(player_2_x, indices)
    player_2_f_y = interp1d(x, y1, fill_value="extrapolate")

    player_2_f_x = interp1d(x, y2, fill_value="extrapolate")
    xnew = np.linspace(0, len(player_2_y), num=len(player_2_y), endpoint=True)

    coordinates = ball_f2_y(xnew)
    # Find all peaks of the ball y index
    peaks, _ = find_peaks(coordinates)
    neg_peaks, _ = find_peaks(coordinates * -1)

    # Get bottom player wrists positions
    left_wrist_index = 9
    right_wrist_index = 10
    skeleton_df = skeleton_df.fillna(-1)
    left_wrist_pos = skeleton_df.iloc[:, [left_wrist_index, left_wrist_index + 15]].values
    right_wrist_pos = skeleton_df.iloc[:, [right_wrist_index, right_wrist_index + 15]].values

    dists = []
    # Calculate dist between ball and bottom player
    for i, player_box in enumerate(player_1_boxes):
        if player_box[0] is not None:
            player_center = center_of_box(player_box[0])
            ball_pos = np.array([ball_f2_x(i), ball_f2_y(i)])
            box_dist = np.linalg.norm(player_center - ball_pos)
            right_wrist_dist, left_wrist_dist = np.inf, np.inf
            if right_wrist_pos[i, 0] > 0:
                right_wrist_dist = np.linalg.norm(right_wrist_pos[i, :] - ball_pos)
            if left_wrist_pos[i, 0] > 0:
                left_wrist_dist = np.linalg.norm(left_wrist_pos[i, :] - ball_pos)
            dists.append(min(box_dist, right_wrist_dist, left_wrist_dist))
        else:
            dists.append(None)
    dists = np.array(dists)

    dists2 = []
    # Calculate dist between ball and top player
    for i in range(len(player_2_centers)):
        ball_pos = np.array([ball_f2_x(i), ball_f2_y(i)])
        box_center = np.array([player_2_f_x(i), player_2_f_y(i)])
        box_dist = np.linalg.norm(box_center - ball_pos)
        dists2.append(box_dist)
    dists2 = np.array(dists2)

    strokes_1_indices = []
    # Find stroke for bottom player by thresholding the dists
    for peak in peaks:
        player_box_height = max(player_1_boxes[peak][0][3] - player_1_boxes[peak][0][1], 130)
        if dists[peak] < (player_box_height * 4 / 5):
            strokes_1_indices.append(peak)

    strokes_2_indices = []
    # Find stroke for top player by thresholding the dists
    for peak in neg_peaks:
        if dists2[peak] < 100:
            strokes_2_indices.append(peak)

    # Assert the diff between two consecutive strokes is below some threshold
    while True:
        diffs = np.diff(strokes_1_indices)
        to_del = []
        for i, diff in enumerate(diffs):
            if diff < 40:
                max_in = np.argmax([dists[strokes_1_indices[i]], dists[strokes_1_indices[i + 1]]])
                to_del.append(i + max_in)

        strokes_1_indices = np.delete(strokes_1_indices, to_del)
        if len(to_del) == 0:
            break

    # Assert the diff between to consecutive strokes is below some threshold
    while True:
        diffs = np.diff(strokes_2_indices)
        to_del = []
        for i, diff in enumerate(diffs):
            if diff < 40:
                max_in = np.argmax([dists2[strokes_2_indices[i]], dists2[strokes_2_indices[i + 1]]])
                to_del.append(i + max_in)

        strokes_2_indices = np.delete(strokes_2_indices, to_del)
        if len(to_del) == 0:
            break

    bounces_indices = [x for x in peaks if x not in strokes_1_indices]

    strokes_1_with_types = []  # For bottom player
    strokes_2_with_types = []  # For top player

    # For bottom player strokes
    for stroke_frame in strokes_1_indices:
        if player_1_boxes[stroke_frame][0] is not None:
            player_center = center_of_box(player_1_boxes[stroke_frame][0])
            ball_pos = np.array([ball_f2_x(stroke_frame), ball_f2_y(stroke_frame)])
            
            # For bottom player: right side (ball_x > player_x) = forehand, left side = backhand
            stroke_type = 0 if ball_pos[0] > player_center[0] else 1
            strokes_1_with_types.append((stroke_frame, stroke_type))

    # For top player strokes
    for stroke_frame in strokes_2_indices:
        player_center = np.array([player_2_f_x(stroke_frame), player_2_f_y(stroke_frame)])
        ball_pos = np.array([ball_f2_x(stroke_frame), ball_f2_y(stroke_frame)])
        
        # For top player: left side (ball_x < player_x) = forehand, right side = backhand
        stroke_type = 0 if ball_pos[0] < player_center[0] else 1
        strokes_2_with_types.append((stroke_frame, stroke_type))

    # Separate the frames and types back into separate lists
    strokes_1_indices = [frame for frame, _ in strokes_1_with_types]
    strokes_1_types = [stroke_type for _, stroke_type in strokes_1_with_types]
    
    strokes_2_indices = [frame for frame, _ in strokes_2_with_types]
    strokes_2_types = [stroke_type for _, stroke_type in strokes_2_with_types]

    return strokes_1_indices, strokes_2_indices, bounces_indices, strokes_1_types, strokes_2_types
