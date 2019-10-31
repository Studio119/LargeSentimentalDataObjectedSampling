#!/usr/bin/env python3
from SSM import SSM as SSM
import sys
# from random import random as rand


if __name__ == '__main__':
    read_file = '../data/917.csv'
    save_file = 'result'
    expected_area = 256
    eta = 0.6
    max_clustered = 0.5
    alpha = -1
    base_threshold = 0.01
    max_threshold = 0.2
    if len(sys.argv) > 1:
        params = sys.argv[1::2]
        values = sys.argv[2::2]
        for i in range(len(params)):
            if params[i] == '--expected_area':
                expected_area = float(values[i])
                pass
            elif params[i] == '--eta':
                eta = float(values[i])
                pass
            elif params[i] == '--alpha':
                alpha = float(values[i])
                pass
            elif params[i] == '--base_threshold':
                base_threshold = float(values[i])
                pass
            elif params[i] == '--max_threshold':
                max_threshold = float(values[i])
                pass
            elif params[i] == '--read_file':
                read_file = values[i]
                pass
            elif params[i] == '--save_file':
                save_file = values[i]
                pass
            else:
                err = "There's not a param named '%s'" % (params[i].lstrip('--'))
                raise KeyError(err)
    if alpha == -1:
        alpha = 1 - (1 / (expected_area * 3.1416 * max_clustered)) ** 0.5
        pass
    ssm = SSM(expected_area=expected_area, eta=eta, alpha=alpha,
              base_threshold=base_threshold, max_threshold=max_threshold)
    data_set = []
    with open(read_file, encoding='utf-8') as file:
        text = file.readlines()
        for t in range(1, len(text)):
            b = text[t].split(',')
            data_set.append({
                'x': float(b[0]),
                'y': float(b[1]),
                'id': t,
                'value': float(b[2])
            })
            pass
        pass
    # for i in range(110000):
    #     data_set.append({'x': rand() * 600, 'y': rand() * 400, 'id': i, 'value': 2 * rand() - 1})
    #     pass
    ssm.fit(data_set)
    _sum = 0
    for e in ssm.leaves:
        _sum += len(e)
        # print(len(e), e)
        # print(len(e), end=', ')
        pass
    _sum /= len(ssm.leaves)
    dt = 0
    for e in ssm.leaves:
        dt += (len(e) - _sum) ** 2
        pass
    # print(str(ssm))
    print("分类数量：", len(ssm.leaves), "类内容量标准差：", dt ** 0.5 / len(ssm.leaves))
    with open('{}.csv'.format(save_file), mode='w', encoding='utf-8') as f:
        f.write('class,id,x,y,value\r')
        for d in ssm.data:
            f.write('{},{},{},{},{}\r'.format(d['leaf_id'], d['id'], d['x'], d['y'], d['value']))
            pass
        pass
    ssm.linkage()
    with open('{}-tree.json'.format(save_file), mode='w', encoding='utf-8') as f:
        f.write(str(ssm.tree).replace("'", '"'))
        pass
    print("Completed")
    pass
