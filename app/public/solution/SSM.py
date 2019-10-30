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

        self.tree = {}
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
        self._max_distance = 646.5583419822547
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
                elif abs(self._expected_area - self._remember[-1]['result']) > \
                        abs(self._expected_area - self._remember[-2]['result']):
                    count += 1
                    if count >= 5:
                        self.leaves = best_clustering
                        break
                    pass
                target = 1
                if source == 1:
                    target = 0
                    pass
                if count > 1 and source < len(self._remember) - 1:
                    self._base_threshold = self._remember[-1]['threshold'] * self._eta \
                                           + self._remember[source]['threshold'] * (1 - self._eta)
                    pass
                else:
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
                    pass
                self._cluster()
                pass
            pass
        result = {}
        for i in range(len(self.leaves)):
            node = self.leaves[i]
            for point in node:
                result[point['id']] = i
                pass
            pass
        for d in self.data:
            d['leaf_id'] = result[d['id']]
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
        center = self._not_included[center_idx]
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

    def linkage(self):
        """
        Find a suitable binary-tree structure
        :return: void
        """
        self.tree = {}
        un_linked = []
        for i in range(len(self.leaves)):
            leaf = self.leaves[i]
            un_linked.append({
                'id': i,
                'x': 0,
                'y': 0,
                'value': 0,
                'set': leaf,
                'children': []
            })
            pass
        while len(un_linked) > 1:
            print("Linking... {} nodes left".format(len(un_linked)))
            for node in un_linked:
                for d in node['set']:
                    node['x'] += d['x']
                    node['y'] += d['y']
                    node['value'] += d['value']
                    pass
                node['x'] /= len(node['set'])
                node['y'] /= len(node['set'])
                node['value'] /= len(node['set'])
                pass
            min_dif = ((un_linked[1]['x'] - un_linked[0]['x']) ** 2 + (un_linked[1]['y'] - un_linked[0]['y']) ** 2) \
                      * self._alpha + (un_linked[1]['value'] - un_linked[0]['value']) * (1 - self._alpha)
            min_cp = [0, 1]
            for i in range(len(un_linked) - 1):
                for j in range(i + 1, len(un_linked)):
                    dif = self._alpha * ((un_linked[j]['x'] - un_linked[i]['x']) ** 2
                                         + (un_linked[j]['x'] - un_linked[i]['x']) ** 2) \
                          + (1 - self._alpha) * (un_linked[j]['value'] - un_linked[i]['value'])
                    if dif < min_dif:
                        min_dif = dif
                        min_cp = [i, j]
                        pass
                    pass
                pass
            set_a = []
            for each in un_linked[min_cp[0]]['set']:
                set_a.append(each)
                pass
            for each in un_linked[min_cp[1]]['set']:
                set_a.append(each)
                pass
            next_un_linked = []
            new_children = []
            if len(un_linked[min_cp[0]]['children']) != 0:
                new_children.append({'children': un_linked[min_cp[0]]['children'],
                                     'value': len(un_linked[min_cp[0]]['set'])})
                pass
            else:
                new_children.append({'id': un_linked[min_cp[0]]['id'],
                                     'value': len(un_linked[min_cp[0]]['set'])})
            if len(un_linked[min_cp[1]]['children']) != 0:
                new_children.append({'children': un_linked[min_cp[1]]['children'],
                                     'value': len(un_linked[min_cp[1]]['set'])})
                pass
            else:
                new_children.append({'id': un_linked[min_cp[1]]['id'],
                                     'value': len(un_linked[min_cp[1]]['set'])})
                pass
            next_un_linked.append({
                'x': 0,
                'y': 0,
                'value': 0,
                'set': set_a,
                'children': new_children
            })
            del un_linked[min_cp[0]]['set']
            del un_linked[min_cp[0]]['x']
            del un_linked[min_cp[0]]['y']
            # del un_linked[min_cp[0]]['value']
            del un_linked[min_cp[1]]['set']
            del un_linked[min_cp[1]]['x']
            del un_linked[min_cp[1]]['y']
            # del un_linked[min_cp[1]]['value']
            for s in range(len(un_linked)):
                if s not in min_cp:
                    next_un_linked.append(un_linked[s])
                    pass
                pass
            un_linked = next_un_linked
            pass
        del un_linked[0]['set']
        del un_linked[0]['x']
        del un_linked[0]['y']
        # del un_linked[0]['value']
        self.tree = un_linked[0]
        return

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
