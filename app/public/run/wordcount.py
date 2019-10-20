#!/usr/bin/env python3
import re
from tqdm import tqdm


def takeSecond(li):
    return li[1]


if __name__ == '__main__':
    filepath = '../data/93.csv'
    minconsequence = 0.001
    maxconsequence = 0.050
    count = 0
    words = {}
    head = []
    with open(filepath, mode='r', encoding='utf-8') as file:
        textset = file.readlines()
        count += len(textset)
        for idx in tqdm(range(len(textset[1:]))):
            text = textset[1:][idx]
            content = text.split(',')[3].replace('"', "")
            clean = re.sub(r' http[^\s]+|http[^\s]+ ', "", content)
            pattern = re.compile(r'#[^\s]+ ')
            results = [string[:-1] for string in pattern.findall(clean)]
            pieces = [x for x in content.split(" ") if x not in results]
            for e in pieces:
                et = e.lower()
                if et in head:
                    words[et] += 1
                    pass
                else:
                    head.append(et)
                    words[et] = 1
                    pass
                count += 1
                pass
            pass
        box = []
        for t in words:
            box.append([t, words[t]])
            pass
        box.sort(key=takeSecond)
        with open(filepath.replace('.csv', '-wordcount.json'), mode='w', encoding='utf-8') as fout:
            fout.write('[\n')
            flag = False
            if len(box) > 0:
                for i in box:
                    if i[1] < count * minconsequence:
                        continue
                    if i[1] > count * maxconsequence:
                        continue
                    if flag:
                        fout.write(',\n')
                        pass
                    fout.write('\t{ "text": "' + i[0] + '", "count": ' + str(i[1]) + ' }')
                    flag = True
                    pass
                pass
            fout.write('\n]\n')
            pass
        pass
    pass

