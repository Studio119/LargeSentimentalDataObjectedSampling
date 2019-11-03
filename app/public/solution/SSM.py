#!/usr/bin/env python3
from random import random as rand
# from tqdm import tqdm


class SSM:
    def __init__(self, eta=0.5, expected_area=-1, alpha=0.9, base_threshold=-1, max_threshold=0.2):
        """
        :param eta: Learning rate, for adjusting the base_threshold
        :param expected_area: Amount of areas expected to cluster
        :param alpha: When we judge difference between two points A & B,
            use this function:
            dif = alpha * ((A.x - B.x) ** 2 + (A.y - B.y) ** 2) + beta * (A.value - B.value)
            in which beta = 1.0 - alpha
        :param max_threshold: Max threshold of difference of each variable
        """

        self._expected_area = expected_area
        self._alpha = alpha
        self._max_threshold = max_threshold

        self._remember = []

        self._index = {}

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

        self._count = 0
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
        print(self)
        self._index = {}
        print("Start clustering...")
        self._cluster()
        count = 0
        best_clustering = self.leaves
        best_dis = self._remember[0]['result']
        source = self._remember[0]['threshold']
        while self._remember[-1]['result'] != self._expected_area:
            left = 0
            right = 0.1     # 1
            target_index = -1
            target_result = -1
            for idx in range(len(self._remember)):
                dis = self._expected_area - self._remember[idx]['result']
                if dis > 0 and best_dis > 0:
                    continue
                if dis < 0 and best_dis < 0:
                    continue
                if target_result == -1:
                    target_index = idx
                    target_result = abs(dis)
                    pass
                elif abs(dis) <= target_result:
                    target_index = idx
                    target_result = abs(dis)
                    # count = 0
                    pass
                pass
            if best_dis > 0:
                # not enough, wanna lower
                right = source
                if target_index != -1:
                    left = self._remember[target_index]['threshold']
                    pass
                pass
            else:
                left = source
                if target_index != -1:
                    right = self._remember[target_index]['threshold']
                    pass
                pass
            if self._expected_area - self._remember[-1]['result'] > 0:
                self._base_threshold = self._base_threshold * (1 - self._alpha) + left * self._alpha
                pass
            else:
                self._base_threshold = self._base_threshold * (1 - self._alpha) + right * self._alpha
                pass
            self._cluster()
            if abs(self._expected_area - self._remember[-1]['result']) < abs(best_dis):
                best_clustering = self.leaves
                best_dis = self._expected_area - self._remember[-1]['result']
                source = self._remember[-1]['threshold']
                count = 0
                pass
            elif len(self._remember) >= 2 and \
                abs(self._expected_area - self._remember[-1]['result']) \
                >= abs(self._expected_area - self._remember[-2]['result']) and \
                    abs(self._expected_area - self._remember[-2]['result']) < self._expected_area ** 0.5:
                count += 1
                if count >= 5:
                    break
            pass
        self.leaves = best_clustering
        result = {}
        for i in range(len(self.leaves)):
            node = self.leaves[i]
            self._index[i] = [n['id'] for n in node]
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
            dis_geo = ((center['x'] - candidate['x']) ** 2 + (center['y'] - candidate['y']) ** 2) ** 0.5 \
                      / self._max_distance
            if center['value'] == 0.0:
                if candidate['value'] != 0.0:
                    others.append(candidate)
                    continue
                pass
            # if dis_geo > self._max_threshold:
            #     others.append(candidate)
            #     continue
            dis_val = (center['value'] - candidate['value']) / (self._value_extends[1] - self._value_extends[0])
            if abs(dis_val) > self._max_threshold:
                others.append(candidate)
                continue
            dif = self._alpha * dis_geo + (1 - self._alpha) * dis_val
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
            # for i in tqdm(range(len(un_linked))):
            # print("Linking... {} nodes left".format(len(un_linked)))
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
            # min_dif = ((un_linked[1]['x'] - un_linked[0]['x']) ** 2 + (un_linked[1]['y'] - un_linked[0]['y']) ** 2) \
            #           * self._alpha + (un_linked[1]['value'] - un_linked[0]['value']) * (1 - self._alpha)
            min_dif = ((un_linked[1]['x'] - un_linked[0]['x']) ** 2 + (un_linked[1]['y'] - un_linked[0]['y']) ** 2)
            min_cp = [0, 1]
            for i in range(len(un_linked) - 1):
                for j in range(i + 1, len(un_linked)):
                    # dif = self._alpha * ((un_linked[j]['x'] - un_linked[i]['x']) ** 2
                    #                      + (un_linked[j]['x'] - un_linked[i]['x']) ** 2) \
                    #       + (1 - self._alpha) * (un_linked[j]['value'] - un_linked[i]['value'])
                    dif = ((un_linked[j]['x'] - un_linked[i]['x']) ** 2
                                         + (un_linked[j]['x'] - un_linked[i]['x']) ** 2)
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
        self._count = 0

        self.tree = self._resolve(self.tree)
        return

    def _resolve(self, parent):
        leftChild = None
        rightChild = None
        form = {
            'id': self._count,
            'leftChild': None,
            'rightChild': None,
            'containedPoints': [],
            'averDiff': None,
            'averVal': None
        }
        self._count += 1
        try:
            if len(parent['children']) > 0:
                if len(parent['children']) > 1:
                    rightChild = parent['children'][1]
                    pass
                leftChild = parent['children'][0]
                pass
            else:
                form['containedPoints'] = self._index[parent['id']]
                pass
            pass
        except KeyError:
            form['containedPoints'] = self._index[parent['id']]
            pass
        if leftChild:
            form['leftChild'] = self._resolve(leftChild)
            form['containedPoints'] = form['containedPoints'] + form['leftChild']['containedPoints']
            pass
        if rightChild:
            form['rightChild'] = self._resolve(rightChild)
            form['containedPoints'] = form['containedPoints'] + form['rightChild']['containedPoints']
            pass
        if leftChild and rightChild:
            form['averDiff'] = abs(form['leftChild']['averVal'] - form['rightChild']['averVal'])
            pass
        form['averVal'] = 0
        for n in form['containedPoints']:
            form['averVal'] += (self.data[n]['value'] + 1) / 2
            pass
        form['averVal'] /= len(form['containedPoints'])
        return form

    def cut(self):
        thrmax = 0
        resmax = 0
        for thr in range(1000):
            tree = self._maycut(self.tree, thr / 1000)
            box = self._diff_all(tree, [])
            aver = 0
            for i in range(len(box) - 1):
                for j in range(i + 1, len(box)):
                    aver += abs(box[i] - box[j])
                    pass
                pass
            aver /= int(len(box) * (len(box) - 1) / 2)
            print("[{}, {}],".format(thr / 1000, aver * (len(box) / len(self.leaves)) ** 0.5))
            if thr == 0 or aver > resmax:
                resmax = aver
                thrmax = thr / 1000
                pass
            pass
        self.tree = self._maycut(self.tree, thrmax)
        return

    def _diff_all(self, parent, box):
        if parent['leftChild']['leftChild'] and parent['leftChild']['rightChild']:
            self._diff_all(parent['leftChild'], box)
            pass
        else:
            box.append(parent['leftChild']['averVal'])
            pass
        if parent['rightChild']['leftChild'] and parent['rightChild']['rightChild']:
            self._diff_all(parent['rightChild'], box)
            pass
        else:
            box.append(parent['rightChild']['averVal'])
            pass
        return box

    def _maycut(self, parent, threshold):
        node = {
            'id': parent['id'],
            'leftChild': None,
            'rightChild': None,
            'containedPoints': parent['containedPoints'],
            'averDiff': parent['averDiff'],
            'averVal': parent['averVal']
        }
        if parent['averDiff'] and parent['averDiff'] > threshold:
            node['leftChild'] = {
                'id': parent['leftChild']['id'],
                'leftChild': None,
                'rightChild': None,
                'containedPoints': parent['leftChild']['containedPoints'],
                'averDiff': parent['leftChild']['averDiff'],
                'averVal': parent['leftChild']['averVal']
            }
            node['rightChild'] = {
                'id': parent['rightChild']['id'],
                'leftChild': None,
                'rightChild': None,
                'containedPoints': parent['rightChild']['containedPoints'],
                'averDiff': parent['rightChild']['averDiff'],
                'averVal': parent['rightChild']['averVal']
            }
            pass
        else:
            if parent['leftChild']:
                node['leftChild'] = self._maycut(parent['leftChild'], threshold)
                pass
            if parent['rightChild']:
                node['rightChild'] = self._maycut(parent['rightChild'], threshold)
                pass
            pass
        return node

    def __str__(self):
        """
        Show some info
        """
        return "Model params:\n" \
               + "expected_area={}, eta={}, alpha={}, ".format(
                    self._expected_area, self._eta, self._alpha
                ) \
               + "base_threshold={}, max_threshold={}\n".format(
                    self._base_threshold, self._max_threshold
                ) \
               + "{} points included\n".format(len(self.data)) \
               + "x extent: {}\n".format(tuple(self._x_extends)) \
               + "y extent: {}\n".format(tuple(self._y_extends)) \
               + "value extent: {}\n".format(tuple(self._value_extends)) \
               + "max geographic distance: {}\n".format(self._max_distance) \
               + "dif:\n\t(a, b) => " \
               + "{} * ((A.x - B.x) ** 2 + (A.y - B.y) ** 2) / {} ".format(self._alpha,
                                                                           self._max_distance) \
               + "+ {} * (A.value - B.value) / {}".format(1 - self._alpha,
                                                          self._value_extends[1] - self._value_extends[0]) \
               + '\n'
