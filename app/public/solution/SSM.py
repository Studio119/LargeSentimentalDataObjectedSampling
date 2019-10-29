#!/usr/bin/env python3
from random import random as rand


# from tqdm import tqdm


class SSM:
    def __init__(self, eta=0.5, expected_area=-1, alpha=0.5, base_threshold=-1):
        """
        :param eta: Learning rate, for adjusting the base_threshold
        :param expected_area: Amount of areas expected to cluster
        :param alpha: When we judge difference between two points A & B,
            use this function:
            dif = alpha * ((A.x - B.x) ** 2 + (A.y - B.y) ** 2) + beta * (A.value - B.value)
            in which beta = 1.0 - alpha
        """

        self._expected_area = expected_area
        self._alpha = alpha
        self._remember = []

        self.data = []
        """
        Origin data points,
        in shape of
        Point: {
            id: any         # unique identifier of this datum
            x: number       # lat. cor.
            y: number       # lng. cor.
            value: number   # value of sentiment
        }
        """

        self._x_extends = [0, 0]
        self._y_extends = [0, 0]
        self._value_extends = [0, 0]
        self._max_distance = 0

        self._not_included = []
        """
        Data points not included
        """

        self._eta = eta
        self._base_threshold = base_threshold

        self.leaves = []
        """
        The base level,
        in shape of
        Leaf: {
            id: number              # unique identifier of this node
            cx: number              # center of the origin round: lat. cor.
            cy: number              # center of the origin round: lng. cor.
            r: number               # initialized value of expected radius
            value: number           # sum of the weighed params as the value of the center
            children: Array<Point>  # set of points contained
        }
        """
        return

    def fit(self, data):
        """
        Import a data set,
        as its origin data points,
        in shape of
        Point: {
            id: any         # unique identifier of this datum
            x: number       # lat. cor.
            y: number       # lng. cor.
            value: number   # value of sentiment
        }
        """
        self.data = data
        self._not_included = data
        if self._expected_area == -1:
            self._expected_area = int(len(data) ** 0.5)
            pass
        self._x_extends = [data[0]['x'], data[0]['x']]
        self._y_extends = [data[0]['y'], data[0]['y']]
        self._value_extends = [data[0]['value'], data[0]['value']]
        print("Importing data...")
        for idx in range(0, len(data)):
            self._x_extends = [min(self._x_extends[0], data[idx]['x']),
                               max(self._x_extends[1], data[idx]['x'])]
            self._y_extends = [min(self._y_extends[0], data[idx]['y']),
                               max(self._y_extends[1], data[idx]['y'])]
            self._value_extends = [min(self._value_extends[0], data[idx]['value']),
                                   max(self._value_extends[1], data[idx]['value'])]
            pass
        self._max_distance = ((self._x_extends[1] - self._x_extends[0]) ** 2
                              + (self._y_extends[1] - self._y_extends[0]) ** 2) ** 0.5
        if self._base_threshold == -1:
            self._base_threshold = 0.2
            pass
        print("Start clustering...")
        self._cluster()
        count = 0
        best_clustering = self.leaves
        while self._remember[-1]['result'] != self._expected_area:
            if len(self._remember) == 1:
                best_clustering = self.leaves
                if len(self.leaves) < self._expected_area:
                    self._base_threshold *= self._eta
                    pass
                else:
                    self._base_threshold = self._eta + self._base_threshold * (1 - self._eta)
                    pass
                self._cluster()
                continue
            else:
                source = 0
                best_dif = abs(self._expected_area - self._remember[0]['result'])
                for idx in range(1, len(self._remember)):
                    dif = abs(self._expected_area - self._remember[idx]['result'])
                    if dif < best_dif:
                        source = idx
                        best_dif = dif
                        pass
                    pass
                if source == len(self._remember) - 1:
                    best_clustering = self.leaves
                    count = 1
                    pass
                else:
                    count += 1
                    if count >= 5:
                        self.leaves = best_clustering
                        break
                    pass
                target = 1
                if source == 1:
                    target = 0
                    pass
                best_dif = abs(self._expected_area - self._remember[target]['result'])
                for idx in range(0, len(self._remember)):
                    if idx == source:
                        continue
                    dif = abs(self._expected_area - self._remember[idx]['result'])
                    if dif < best_dif:
                        target = idx
                        best_dif = dif
                        pass
                    pass
                self._base_threshold = self._remember[target]['threshold'] * self._eta \
                                       + self._remember[source]['threshold'] * (1 - self._eta)
                self._cluster()
                pass
            pass
        return

    def _cluster(self):
        """
        Gather all points in some auto-growing areas
        """
        self._not_included = self.data
        self.leaves = []
        flag = int(rand() * len(self.data))
        flag = self._generate(flag)
        while len(self._not_included) > 0:
            flag = self._generate(flag)
            if flag == -1:
                break
            pass
        self._remember.append({
            'threshold': self._base_threshold,
            'result': len(self.leaves)
        })
        print(len(self._remember), {
            'threshold': self._base_threshold,
            'result': len(self.leaves)
        })
        return

    def _generate(self, center_idx):
        """
        Generator of a new area
        """
        center = self.data[center_idx]
        area = [center]
        others = []
        for i in range(len(self._not_included)):
            if i == center_idx:
                continue
            candidate = self._not_included[i]
            dif = self._alpha * ((center['x'] - candidate['x']) ** 2 + (center['y'] - candidate['y']) ** 2) ** 0.5 \
                  / self._max_distance + (1 - self._alpha) * (center['value'] - candidate['value']) \
                  / (self._value_extends[1] - self._value_extends[0])
            if dif <= self._base_threshold:
                area.append(candidate)
                pass
            else:
                others.append(candidate)
                pass
            pass
        self.leaves.append(area)
        self._not_included = others
        if len(self._not_included) == 0:
            return -1
        else:
            return int(rand() * len(self._not_included))

    def __str__(self):
        """
        Show some info
        """
        return "{} points included\n".format(len(self.data)) \
               + "x extent: {}\n".format(tuple(self._x_extends)) \
               + "y extent: {}\n".format(tuple(self._y_extends)) \
               + "value extent: {}\n".format(tuple(self._value_extends)) \
               + "max geographic distance: {}\n".format(self._max_distance) \
               + "dif:\n\t(a, b) =>" \
               + "{} * ((A.x - B.x) ** 2 + (A.y - B.y) ** 2) / {} ".format(self._alpha,
                                                                           self._max_distance) \
               + "+ {} * (A.value - B.value) / {}".format(1 - self._alpha,
                                                          self._value_extends[1] - self._value_extends[0]) \
               + '\n'
