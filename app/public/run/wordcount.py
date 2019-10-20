#!/usr/bin/env python3
import re
from tqdm import tqdm

stopwords = [
	"little",
	"other",
	"trying",
	"won",
	"nothing",
	"already",
	"well",
	"same",
	"hrc",
	"call",
	"work",
	"ur",
	"everyone",
	"its",
	"getting",
	"today",
	"ever",
	"sure",
	"saying",
	"share",
	"put",
	"anyone",
	"big",
	"help",
	"most",
	"thing",
	"hate",
	"next",
	"here",
	"bad",
	"where",
	"before",
	"tell",
	"hope",
	"first",
	"better",
	"again",
	"another",
	"candidate",
	"r",
	"wants",
	"watch",
	"show",
	"give",
	"real",
	"then",
	"day",
	"am",
	"lol",
	"too",
	"best",
	"very",
	"last",
	"every",
	"those",
	"needs",
	"off",
	"thank",
	"look",
	"let",
	"into",
	"god",
	"made",
	"could",
	"down",
	"voted",
	"much",
	"any",
	"final",
	"please",
	"were",
	"some",
	"many",
	"way",
	"keep",
	"win",
	"believe",
	"yep",
	"really",
	"winner",
	"still",
	"come",
	"being",
	"got",
	"right",
	"does",
	"against",
	"had",
	"via",
	"even",
	"stop",
	"says",
	"them",
	"after",
	"watching",
	"back",
	"live",
	"take",
	"said",
	"never",
	"there",
	"been",
	"told",
	"these",
	"voting",
	"say",
	"new",
	"good",
	"because",
	"must",
	"want",
	"did",
	"him",
	"us",
	"think",
	"4",
	"only",
	"need",
	"than",
	"go",
	"their",
	"over",
	"make",
	"great",
	"u",
	"one",
	"should",
	"going",
	"now",
	"see",
	"me",
	"know",
	"an",
	"2",
	"america",
	"she",
	"why",
	"would",
	"her",
	"when",
	"or",
	"more",
	"our",
	"up",
	"people",
	"do",
	"can",
	"but",
	"how",
	"out",
	"from",
	"get",
	"who",
	"as",
	"by",
	"was",
	"my",
	"like",
	"if",
	"no",
	"they",
	"has",
	"your",
	"at",
	"so",
	"about",
	"what",
	"his",
	"vote",
	"all",
	"have",
	"just",
	"with",
	"it",
	"not",
	"he",
	"we",
	"are",
	"be",
	"will",
	"that",
	"this",
	"you",
	"on",
	"i",
	"in",
	"and",
	"for",
	"of",
	"is",
	"a",
	"to",
	"the"
]


def takeSecond(li):
    return li[1]


if __name__ == '__main__':
    filepath = '../data/93.csv'
    minconsequence = 0.0001
    maxconsequence = 0.0100
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
                if e in stopwords:
                    continue
                if e.isalnum():
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
                    fout.write('\t"' + i[0] + '", "count": ' + str(i[1]) + ' }')
                    flag = True
                    pass
                pass
            fout.write('\n]\n')
            pass
        pass
    pass

