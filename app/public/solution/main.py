#!/usr/bin/env python3
from SSM import SSM as SSM
# from random import random as rand


if __name__ == '__main__':
    ssm = SSM(expected_area=256, eta=0.6, alpha=0.5, base_threshold=0.01)
    data_set = []
    with open('../data/917.csv', encoding='utf-8') as file:
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
    with open('result.csv', mode='w', encoding='utf-8') as f:
        f.write('class,id,x,y,value\r')
        for d in ssm.data:
            f.write('{},{},{},{},{}\r'.format(d['leaf_id'], d['id'], d['x'], d['y'], d['value']))
            pass
        pass
    ssm.linkage()
    with open('result-tree.json', mode='w', encoding='utf-8') as f:
        print(ssm.tree)
        f.write(str(ssm.tree).replace("'", '"'))
        pass
    pass
