import cv2
import numpy as np
from utils.line_utils import line_intersection, sort_intersection_points
from itertools import combinations
from court_reference import CourtReference
from matplotlib import pyplot as plt


class CourtDetection:
    def __init__(self, verbose: bool):
        self.verbose = verbose
        self.color_threshold = 200
        self.line_distance_threshold = 5
        self.line_intensity_threshold = 60
        self.original_frame = None
        self.color_threshold_frame = None
        self.frame_width = 0
        self.frame_height = 0
        self.highest_vertical_line_y = np.inf
        self.lowest_vertical_line_y = 0
        self.line_merge_threshold = 10
        self.court_reference = CourtReference()
        self.court_warp_matrix = []
        self.game_warp_matrix = []
        self.court_score = 0
        self.success_flag = False
        self.success_accuracy = 80
        self.success_score = 1000
        self.baseline_top = None
        self.baseline_bottom = None
        self.net = None
        self.left_court_line = None
        self.right_court_line = None
        self.left_inner_line = None
        self.right_inner_line = None
        self.middle_line = None
        self.top_inner_line = None
        self.bottom_inner_line = None

    def detect_court(self, img_frame):
        self.original_frame = img_frame
        self.frame_height, self.frame_width = img_frame.shape[:2]

        # Step 1: Extract court pixels
        color_threshold_frame, filtered_lines_frames = self._extract_court_pixels(img_frame)
        self.color_threshold_frame = color_threshold_frame

        # Step 2: Detect Court Lines
        horizontal, vertical_left, vertical_right = self._detect_court_lines(filtered_lines_frames)

        # Step 3: Court Correspondences
        court_warp_matrix, game_warp_matrix, self.court_score = self._find_court_correspondences(horizontal,
                                                                                                 vertical_left,
                                                                                                 vertical_right)

        self.court_warp_matrix.append(court_warp_matrix)
        self.game_warp_matrix.append(game_warp_matrix)

        court_accuracy = self._get_court_accuracy()
        if court_accuracy > self.success_accuracy and self.court_score > self.success_score:
            self.success_flag = True
            print('Court detected successfully')
        print('Court accuracy = %.2f' % court_accuracy)

        self.find_lines_location()

    def _extract_court_pixels(self, img_frame):
        color_threshold_frame = self._threshold_white_pixels(img_frame)
        filtered_lines_frame = self._filter_belongs_to_line(color_threshold_frame)

        if self.verbose:
            cv2.imshow('extract-court-pixels', filtered_lines_frame)
            if cv2.waitKey(0) & 0xff == 27:
                cv2.destroyAllWindows()

        return color_threshold_frame, filtered_lines_frame

    def _threshold_white_pixels(self, img_frame):
        gray = cv2.cvtColor(img_frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.threshold(gray, self.color_threshold, 255, cv2.THRESH_BINARY)[1]

        return gray

    def _filter_belongs_to_line(self, color_threshold_frame):
        for i in range(self.line_distance_threshold, len(color_threshold_frame) - self.line_distance_threshold):
            for j in range(self.line_distance_threshold, len(color_threshold_frame[0]) - self.line_distance_threshold):
                if color_threshold_frame[i, j] == 0:
                    continue
                if (color_threshold_frame[i, j] - color_threshold_frame[
                    i + self.line_distance_threshold, j] > self.line_intensity_threshold and
                        color_threshold_frame[i, j] - color_threshold_frame[
                            i - self.line_distance_threshold, j] > self.line_intensity_threshold):
                    continue

                if (color_threshold_frame[i, j] - color_threshold_frame[
                    i, j + self.line_distance_threshold] > self.line_intensity_threshold and
                        color_threshold_frame[i, j] - color_threshold_frame[
                            i, j - self.line_distance_threshold] > self.line_intensity_threshold):
                    continue
                color_threshold_frame[i, j] = 0
        return color_threshold_frame

    def _detect_court_lines(self, img_frame):
        # 2.1: Line detection
        lines = cv2.HoughLinesP(img_frame, 1, np.pi / 180, 80, minLineLength=100, maxLineGap=20)
        lines = np.squeeze(lines)

        if self.verbose:
            self._draw_lines_from_vertical_and_horizontal(self.original_frame.copy(), 'line-detection', [], lines, [])

        # 2.2: Selected lines classification
        horizontal, vertical_left, vertical_right = self._classify_and_sort_lines(lines)

        if self.verbose:
            self._draw_lines_from_vertical_and_horizontal(self.original_frame.copy(), 'line-classification', horizontal,
                                                          vertical_left,
                                                          vertical_right)
        # 2.3: Line merging
        horizontal, vertical_left, vertical_right = self._merge_lines(horizontal, vertical_left, vertical_right)

        if self.verbose:
            self._draw_lines_from_vertical_and_horizontal(self.original_frame.copy(), 'line-merging', horizontal,
                                                          vertical_left,
                                                          vertical_right)

        return horizontal, vertical_left, vertical_right

    def _classify_and_sort_lines(self, lines):
        horizontal = []
        vertical = []

        for line in lines:
            x1, y1, x2, y2 = line
            dx = abs(x1 - x2)
            dy = abs(y1 - y2)
            if dx > dy:
                horizontal.append(line)
            else:
                vertical.append(line)
                self.highest_vertical_line_y = min(self.highest_vertical_line_y, y1, y2)
                self.lowest_vertical_line_y = max(self.lowest_vertical_line_y, y1, y2)

        vertical_left, vertical_right = self._classify_vertical_lines(vertical)
        horizontal = self._filter_horizontal_lines(horizontal)

        horizontal.sort(key=lambda item: (item[1], item[0]))
        vertical_left.sort(key=lambda item: (-item[0], item[1]))
        vertical_right.sort(key=lambda item: (item[0], item[1]))

        return horizontal, vertical_left, vertical_right

    def _filter_horizontal_lines(self, horizontal_lines):
        filtered_horizontal = []
        h = self.lowest_vertical_line_y - self.highest_vertical_line_y
        self.lowest_vertical_line_y += h / 15
        self.highest_vertical_line_y -= h * 2 / 15

        for line in horizontal_lines:
            x1, y1, x2, y2 = line
            if (self.lowest_vertical_line_y > y1 > self.highest_vertical_line_y
                    and self.lowest_vertical_line_y > y1 > self.highest_vertical_line_y):
                filtered_horizontal.append(line)

        return filtered_horizontal

    def _classify_vertical_lines(self, vertical_lines):
        vertical_left = []
        vertical_right = []
        right_th = self.frame_width * 4 / 7
        left_th = self.frame_width * 3 / 7

        for line in vertical_lines:
            x1, y1, x2, y2 = line
            if x1 < left_th or x2 < left_th:
                vertical_left.append(line)
            elif x1 > right_th or x2 > right_th:
                vertical_right.append(line)

        return vertical_left, vertical_right

    def _merge_lines(self, horizontal_lines, vertical_left_lines, vertical_right_lines):
        # Merge horizontal lines
        mask = [True] * len(horizontal_lines)
        new_horizontal_lines = []
        for i, line in enumerate(horizontal_lines):
            if mask[i]:
                for j, s_line in enumerate(horizontal_lines[i + 1:]):
                    if mask[i + j + 1]:
                        x1, y1, x2, y2 = line
                        x3, y3, x4, y4 = s_line
                        dy = abs(y3 - y2)
                        if dy < self.line_merge_threshold:
                            points = sorted([(x1, y1), (x2, y2), (x3, y3), (x4, y4)], key=lambda x: x[0])
                            line = np.array([*points[0], *points[-1]])
                            mask[i + j + 1] = False
                new_horizontal_lines.append(line)

        # Merge vertical lines
        xl, yl, xr, yr = (0, self.frame_height * 6 / 7, self.frame_width, self.frame_height * 6 / 7)

        mask = [True] * len(vertical_left_lines)
        new_vertical_left_lines = []
        for i, line in enumerate(vertical_left_lines):
            if mask[i]:
                for j, s_line in enumerate(vertical_left_lines[i + 1:]):
                    if mask[i + j + 1]:
                        x1, y1, x2, y2 = line
                        x3, y3, x4, y4 = s_line
                        xi, yi = line_intersection(((x1, y1), (x2, y2)), ((xl, yl), (xr, yr)))
                        xj, yj = line_intersection(((x3, y3), (x4, y4)), ((xl, yl), (xr, yr)))

                        dx = abs(xi - xj)
                        if dx < self.line_merge_threshold:
                            points = sorted([(x1, y1), (x2, y2), (x3, y3), (x4, y4)], key=lambda x: x[1])
                            line = np.array([*points[0], *points[-1]])
                            mask[i + j + 1] = False

                new_vertical_left_lines.append(line)

        mask = [True] * len(vertical_right_lines)
        new_vertical_right_lines = []
        for i, line in enumerate(vertical_right_lines):
            if mask[i]:
                for j, s_line in enumerate(vertical_right_lines[i + 1:]):
                    if mask[i + j + 1]:
                        x1, y1, x2, y2 = line
                        x3, y3, x4, y4 = s_line
                        xi, yi = line_intersection(((x1, y1), (x2, y2)), ((xl, yl), (xr, yr)))
                        xj, yj = line_intersection(((x3, y3), (x4, y4)), ((xl, yl), (xr, yr)))

                        dx = abs(xi - xj)
                        if dx < self.line_merge_threshold:
                            points = sorted([(x1, y1), (x2, y2), (x3, y3), (x4, y4)], key=lambda x: x[1])
                            line = np.array([*points[0], *points[-1]])
                            mask[i + j + 1] = False

                new_vertical_right_lines.append(line)

        return new_horizontal_lines, new_vertical_left_lines, new_vertical_right_lines

    def _find_court_correspondences(self, horizontal_lines, vertical_left_lines, vertical_right_lines):
        max_score = -np.inf
        max_mat = None
        max_inv_mat = None
        k = 0

        for horizontal_pair in list(combinations(horizontal_lines, 2)):
            for vertical_pair in list(combinations(vertical_left_lines + vertical_right_lines, 2)):
                h1, h2 = horizontal_pair
                v1, v2 = vertical_pair
                # Finding intersection points of all lines
                i1 = line_intersection((tuple(h1[:2]), tuple(h1[2:])), (tuple(v1[0:2]), tuple(v1[2:])))
                i2 = line_intersection((tuple(h1[:2]), tuple(h1[2:])), (tuple(v2[0:2]), tuple(v2[2:])))
                i3 = line_intersection((tuple(h2[:2]), tuple(h2[2:])), (tuple(v1[0:2]), tuple(v1[2:])))
                i4 = line_intersection((tuple(h2[:2]), tuple(h2[2:])), (tuple(v2[0:2]), tuple(v2[2:])))

                intersections = [i1, i2, i3, i4]
                intersections = sort_intersection_points(intersections)

                for i, configuration in self.court_reference.court_conf.items():
                    # Find transformation
                    matrix, _ = cv2.findHomography(np.float32(configuration), np.float32(intersections), method=0)
                    inv_matrix = cv2.invert(matrix)[1]

                    # Get transformation score
                    confi_score = self._get_confidence_score(matrix)

                    if max_score < confi_score:
                        max_score = confi_score
                        max_mat = matrix
                        max_inv_mat = inv_matrix
                        self.best_conf = i

                    k += 1

        if self.verbose:
            court = self.add_court_overlay(self.original_frame.copy(), max_mat, (255, 0, 0))
            cv2.imshow('court correspondences', court)
            if cv2.waitKey(0) & 0xff == 27:
                cv2.destroyAllWindows()

        print(f'Score = {max_score}')
        print(f'Combinations tested = {k}')

        return max_mat, max_inv_mat, max_score

    def _get_confidence_score(self, matrix):
        court = cv2.warpPerspective(self.court_reference.court, matrix, self.original_frame.shape[1::-1])
        court[court > 0] = 1
        color_threshold_frame = self.color_threshold_frame.copy()
        color_threshold_frame[color_threshold_frame > 0] = 1
        correct = court * color_threshold_frame
        wrong = court - correct
        c_p = np.sum(correct)
        w_p = np.sum(wrong)
        return c_p - 0.5 * w_p

    def add_court_overlay(self, frame, homography=None, overlay_color=(255, 255, 255), frame_num=-1):
        if homography is None and len(self.court_warp_matrix) > 0 and frame_num < len(self.court_warp_matrix):
            homography = self.court_warp_matrix[frame_num]
        court = cv2.warpPerspective(self.court_reference.court, homography, frame.shape[1::-1])
        frame[court > 0, :] = overlay_color
        return frame

    # noinspection PyTypeChecker
    def _get_court_accuracy(self):
        color_threshold_frame = self.color_threshold_frame.copy()
        color_threshold_frame[color_threshold_frame > 0] = 1
        color_threshold_frame = cv2.dilate(color_threshold_frame, np.ones((9, 9), dtype=np.uint8))
        court = self._get_warped_court()
        total_white_pixels = sum(sum(court))

        sub = court.copy()
        sub[color_threshold_frame == 1] = 0
        accuracy = 100 - (sum(sum(sub)) / total_white_pixels) * 100

        if self.verbose:
            plt.figure()
            plt.subplot(1, 3, 1)
            plt.imshow(color_threshold_frame, cmap='gray')
            plt.title('Grayscale frame'), plt.xticks([]), plt.yticks([])
            plt.subplot(1, 3, 2)
            plt.imshow(court, cmap='gray')
            plt.title('Projected court'), plt.xticks([]), plt.yticks([])
            plt.subplot(1, 3, 3)
            plt.imshow(sub, cmap='gray')
            plt.title('Subtraction result'), plt.xticks([]), plt.yticks([])
            plt.show()
        return accuracy

    def _get_warped_court(self):
        court = cv2.warpPerspective(self.court_reference.court, self.court_warp_matrix[-1],
                                    self.original_frame.shape[1::-1])
        court[court > 0] = 1
        return court

    def find_lines_location(self):
        p = np.array(self.court_reference.get_important_lines(), dtype=np.float32).reshape((-1, 1, 2))
        lines = cv2.perspectiveTransform(p, self.court_warp_matrix[-1]).reshape(-1)
        self.baseline_top = lines[:4]
        self.baseline_bottom = lines[4:8]
        self.net = lines[8:12]
        self.left_court_line = lines[12:16]
        self.right_court_line = lines[16:20]
        self.left_inner_line = lines[20:24]
        self.right_inner_line = lines[24:28]
        self.middle_line = lines[28:32]
        self.top_inner_line = lines[32:36]
        self.bottom_inner_line = lines[36:40]

        if self.verbose:
            self._draw_lines_from_vertical_and_horizontal(self.original_frame.copy(),
                                                          [self.baseline_top, self.baseline_bottom,
                                                           self.net, self.top_inner_line,
                                                           self.bottom_inner_line],
                                                          [self.left_court_line, self.right_court_line,
                                                           self.right_inner_line, self.left_inner_line,
                                                           self.middle_line])

    def _draw_lines_from_vertical_and_horizontal(self, img_frame, name, horizontal=(), vertical_left=(),
                                                 vertical_right=()):
        for line in horizontal:
            x1, y1, x2, y2 = line
            cv2.line(img_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.circle(img_frame, (x1, y1), 1, (255, 0, 0), 2)
            cv2.circle(img_frame, (x2, y2), 1, (255, 0, 0), 2)

        for line in vertical_left:
            x1, y1, x2, y2 = line
            cv2.line(img_frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.circle(img_frame, (x1, y1), 1, (255, 0, 0), 2)
            cv2.circle(img_frame, (x2, y2), 1, (255, 0, 0), 2)

        for line in vertical_right:
            x1, y1, x2, y2 = line
            cv2.line(img_frame, (x1, y1), (x2, y2), (255, 255, 0), 2)
            cv2.circle(img_frame, (x1, y1), 1, (255, 0, 0), 2)
            cv2.circle(img_frame, (x2, y2), 1, (255, 0, 0), 2)

        cv2.imshow(name, img_frame)
        if cv2.waitKey(0) & 0xff == 27:
            cv2.destroyAllWindows()

        return img_frame

    def get_extra_parts_location(self, frame_num=-1):
        parts = np.array(self.court_reference.get_extra_parts(), dtype=np.float32).reshape((-1, 1, 2))
        parts = cv2.perspectiveTransform(parts, self.court_warp_matrix[frame_num]).reshape(-1)
        top_part = parts[:2]
        bottom_part = parts[2:]
        return top_part, bottom_part


if __name__ == '__main__':
    clay_surface_path = 'images/clay_surface.png'
    hard_surface_path = 'images/hard_surface.png'
    grass_surface_path = 'images/grass_surface.jpg'

    clay_img = cv2.imread(clay_surface_path)
    hard_img = cv2.imread(hard_surface_path)
    grass_img = cv2.imread(grass_surface_path)

    import time

    start_time = time.time()

    clay_court_detection = CourtDetection(verbose=False)
    clay_court_detection.detect_court(clay_img)

    cv2.imshow('test_clay', clay_court_detection.add_court_overlay(clay_img.copy(), overlay_color=(255, 0, 0)))
    if cv2.waitKey(0):
        cv2.destroyAllWindows()

    hard_court_detection = CourtDetection(verbose=False)
    hard_court_detection.detect_court(hard_img)

    cv2.imshow('test_hard', hard_court_detection.add_court_overlay(hard_img.copy(), overlay_color=(255, 0, 0)))
    if cv2.waitKey(0):
        cv2.destroyAllWindows()

    grass_court_detection = CourtDetection(verbose=False)
    grass_court_detection.detect_court(grass_img)

    cv2.imshow('test_grass', grass_court_detection.add_court_overlay(grass_img.copy(), overlay_color=(255, 0, 0)))
    if cv2.waitKey(0):
        cv2.destroyAllWindows()

    print(f'Elapsed time: {time.time() - start_time}')
