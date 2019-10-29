#!/usr/bin/env python3
from SSM import SSM as SSM
from random import random as rand


if __name__ == '__main__':
    ssm = SSM(expected_area=10000, eta=0.8, alpha=0.8, base_threshold=1e-7)
    data_set = []
    with open('../data/93.csv', encoding='utf-8') as file:
        text = file.readlines()
        for t in text[1:]:
            b = t.split(',')
            data_set.append({
                'x': float(b[1]),
                'y': float(b[2]),
                'id': float(b[0]),
                'value': float(b[6])
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
    pass
