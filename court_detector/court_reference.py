import os

import cv2
import numpy as np
import matplotlib.pyplot as plt


class CourtReference:
    def __init__(self):
        self.baseline_top = ((286, 561), (1379, 561))
        self.baseline_bottom = ((286, 2935), (1379, 2935))
        self.net = ((286, 1748), (1379, 1748))
        self.left_court_line = ((286, 561), (286, 2935))
        self.right_court_line = ((1379, 561), (1379, 2935))
        self.left_inner_line = ((423, 561), (423, 2935))
        self.right_inner_line = ((1242, 561), (1242, 2935))
        self.middle_line = ((832, 1110), (832, 2386))
        self.top_inner_line = ((423, 1110), (1242, 1110))
        self.bottom_inner_line = ((423, 2386), (1242, 2386))
        self.top_extra_part = (832.5, 580)
        self.bottom_extra_part = (832.5, 2910)

        self.court_conf = {1: [*self.baseline_top, *self.baseline_bottom],
                           2: [self.left_inner_line[0], self.right_inner_line[0], self.left_inner_line[1],
                               self.right_inner_line[1]],
                           3: [self.left_inner_line[0], self.right_court_line[0], self.left_inner_line[1],
                               self.right_court_line[1]],
                           4: [self.left_court_line[0], self.right_inner_line[0], self.left_court_line[1],
                               self.right_inner_line[1]],
                           5: [*self.top_inner_line, *self.bottom_inner_line],
                           6: [*self.top_inner_line, self.left_inner_line[1], self.right_inner_line[1]],
                           7: [self.left_inner_line[0], self.right_inner_line[0], *self.bottom_inner_line],
                           8: [self.right_inner_line[0], self.right_court_line[0], self.right_inner_line[1],
                               self.right_court_line[1]],
                           9: [self.left_court_line[0], self.left_inner_line[0], self.left_court_line[1],
                               self.left_inner_line[1]],
                           10: [self.top_inner_line[0], self.middle_line[0], self.bottom_inner_line[0],
                                self.middle_line[1]],
                           11: [self.middle_line[0], self.top_inner_line[1], self.middle_line[1],
                                self.bottom_inner_line[1]],
                           12: [*self.bottom_inner_line, self.left_inner_line[1], self.right_inner_line[1]]}
        self.line_width = 1
        self.court_width = 1117
        self.court_height = 2408
        self.top_bottom_border = 549
        self.right_left_border = 274
        self.court_total_width = self.court_width + self.right_left_border * 2
        self.court_total_height = self.court_height + self.top_bottom_border * 2

        self.config_dir = os.path.join(os.path.dirname(__file__), 'configs')
        os.makedirs(self.config_dir, exist_ok=True)

        self._build_court_reference()
        self.court = cv2.cvtColor(cv2.imread(os.path.join(self.config_dir, "court_reference.png")), cv2.COLOR_BGR2GRAY)

        self._save_all_court_configurations()

    def _build_court_reference(self):
        court = np.zeros(
            (self.court_height + 2 * self.top_bottom_border, self.court_width + 2 * self.right_left_border),
            dtype=np.uint8)

        cv2.line(court, self.baseline_top[0], self.baseline_top[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.baseline_bottom[0], self.baseline_bottom[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.net[0], self.net[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.top_inner_line[0], self.top_inner_line[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.bottom_inner_line[0], self.bottom_inner_line[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.left_court_line[0], self.left_court_line[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.right_court_line[0], self.right_court_line[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.left_inner_line[0], self.left_inner_line[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.right_inner_line[0], self.right_inner_line[1], (255, 255, 255), self.line_width)
        cv2.line(court, self.middle_line[0], self.middle_line[1], (255, 255, 255), self.line_width)

        court = cv2.dilate(court, np.ones((5, 5), dtype=np.uint8))
        plt.imsave(os.path.join(self.config_dir, 'court_reference.png'), court, cmap='gray')

        return court

    def _save_all_court_configurations(self):
        for i, conf in self.court_conf.items():
            court_ref = cv2.cvtColor(255 - self.court, cv2.COLOR_GRAY2BGR)
            for p in conf:
                court_ref = cv2.circle(court_ref, p, 15, (0, 0, 255), 30)
            cv2.imwrite(os.path.join(self.config_dir, f'court_conf_{i}.png'), court_ref)

    def get_extra_parts(self):
        parts = [self.top_extra_part, self.bottom_extra_part]
        return parts

    def get_important_lines(self):
        lines = [*self.baseline_top, *self.baseline_bottom, *self.net, *self.left_court_line, *self.right_court_line,
                 *self.left_inner_line, *self.right_inner_line, *self.middle_line,
                 *self.top_inner_line, *self.bottom_inner_line]
        return lines


if __name__ == '__main__':
    c = CourtReference()
