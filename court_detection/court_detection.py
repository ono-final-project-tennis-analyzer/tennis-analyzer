import cv2
import numpy as np


class CourtDetection:
    def __init__(self, verbose: bool):
        self.verbose = verbose
        self.color_threshold = 200
        self.line_distance_threshold = 5
        self.line_intensity_threshold = 60
        self.original_frame = None
        self.frame_width = 0
        self.frame_height = 0
        self.highest_vertical_line_y = np.inf
        self.lowest_vertical_line_y = 0

    def detect_court(self, img_frame):
        self.original_frame = img_frame
        self.frame_height, self.frame_width = img_frame.shape[:2]

        # Step 1: Extract court pixels
        new_img_frame = self._extract_court_pixels(img_frame)

        if self.verbose:
            cv2.imshow('court', new_img_frame)
            if cv2.waitKey(0) & 0xff == 27:
                cv2.destroyAllWindows()

        # Step 2: Detect Court Lines
        self._detect_court_lines(new_img_frame)

        return new_img_frame

    def _extract_court_pixels(self, img_frame):
        color_threshold_frame = self._threshold_white_pixels(img_frame)
        belongs_to_line_frame = self._filter_belongs_to_line(color_threshold_frame)

        return belongs_to_line_frame

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
            self._draw_lines_from_vertical_and_horizontal(self.original_frame.copy(), [], lines, [])

        # 2.2: Selected lines classification
        horizontal, vertical_left, vertical_right = self._classify_and_sort_lines(lines)

        if self.verbose:
            self._draw_lines_from_vertical_and_horizontal(self.original_frame.copy(), horizontal, vertical_left,
                                                          vertical_right)

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

    def _merge_lines(self, horizontal_lines, vertical_lines):
        mask = [True] * len(horizontal_lines)
        new_horizontal_lines = []
        for i, line in enumerate(horizontal_lines):
            if mask[i]:
                for j, s_line in enumerate(horizontal_lines[i + 1:]):
                    if mask[i + j + 1]:
                        x1, y1, x2, y2 = line
                        x3, y3, x4, y4 = s_line
                        dy = abs(y3 - y2)
                        if dy < 10:
                            points = sorted([(x1, y1), (x2, y2), (x3, y3), (x4, y4)], key=lambda x: x[0])
                            line = np.array([*points[0], *points[-1]])
                            mask[i + j + 1] = False
                new_horizontal_lines.append(line)

        # Merge vertical lines
        vertical_lines = sorted(vertical_lines, key=lambda item: item[1])
        xl, yl, xr, yr = (0, self.v_height * 6 / 7, self.v_width, self.v_height * 6 / 7)
        mask = [True] * len(vertical_lines)
        new_vertical_lines = []
        for i, line in enumerate(vertical_lines):
            if mask[i]:
                for j, s_line in enumerate(vertical_lines[i + 1:]):
                    if mask[i + j + 1]:
                        x1, y1, x2, y2 = line
                        x3, y3, x4, y4 = s_line
                        xi, yi = line_intersection(((x1, y1), (x2, y2)), ((xl, yl), (xr, yr)))
                        xj, yj = line_intersection(((x3, y3), (x4, y4)), ((xl, yl), (xr, yr)))

                        dx = abs(xi - xj)
                        if dx < 10:
                            points = sorted([(x1, y1), (x2, y2), (x3, y3), (x4, y4)], key=lambda x: x[1])
                            line = np.array([*points[0], *points[-1]])
                            mask[i + j + 1] = False

                new_vertical_lines.append(line)
        return new_horizontal_lines, new_vertical_lines

    def _draw_lines_from_vertical_and_horizontal(self, img_frame, horizontal=(), vertical_left=(), vertical_right=()):
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

        cv2.imshow('court', img_frame)
        if cv2.waitKey(0) & 0xff == 27:
            cv2.destroyAllWindows()

        return img_frame


if __name__ == '__main__':
    file_path = './images/image1.png'

    img = cv2.imread(file_path)
    import time

    start_time = time.time()

    court_detection = CourtDetection(verbose=True)
    court_detection.detect_court(img)
