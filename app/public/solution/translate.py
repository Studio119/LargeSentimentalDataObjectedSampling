#!/usr/bin/env python3
from tqdm import tqdm


with open('../data/9.17.json', mode='r', encoding='utf-8') as file:
    text = file.readlines()[0].split('},{')
    with open('../data/917.csv', mode='w', encoding='utf-8') as out:
        out.write('x,y,sentiment\r')
        for i in tqdm(range(len(text))):
            t = text[i]
            cont = t.replace('"x"', '').replace('"y"', '').replace('"sentiment"', '')\
                .replace(':', '').replace('"', '').split(',')
            out.write('{},{},{}\r'.format(cont[2], cont[3], cont[4]))
            pass
        pass
    pass
