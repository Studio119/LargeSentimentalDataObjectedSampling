import re


def takeSecond(li):
    return li[1]


if __name__ == '__main__':
    filepath = '../data/93.csv'
    minconsequence = 0.01
    count = 0
    themes = {}
    with open(filepath, mode='r', encoding='utf-8') as file:
        textset = file.readlines()
        count = len(textset)
        for text in textset[1:]:
            content = text.split(',')[3]
            clean = re.sub(r' http[^\s]+|http[^\s]+ ', "", content)
            pattern = re.compile(r'#[^\s]+ ')
            results = [string[:-1] for string in pattern.findall(clean)]
            if len(results) > 0:
                for topic in results:
                    if topic in themes:
                        themes[topic] += 1
                        pass
                    else:
                        themes[topic] = 1
                        pass
                    pass
                pass
            pass
        box = []
        for t in themes:
            box.append([t, themes[t]])
            pass
        box.sort(key=takeSecond)
        with open(filepath.replace('.csv', '-topics.json'), mode='w', encoding='utf-8') as fout:
            fout.write('[\n')
            flag = False
            if len(box) > 0:
                for i in box:
                    if i[1] < count * minconsequence:
                        continue
                    if flag:
                        fout.write(',\n')
                        pass
                    fout.write('\t{ "topic": "' + i[0] + '", "count": ' + str(i[1]) + ' }')
                    flag = True
                    pass
                pass
            fout.write('\n]\n')
            pass
        pass
    pass

