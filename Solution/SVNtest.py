import numpy as np
import matplotlib.pyplot as plt
import json
from sklearn import svm

# import some data to play with
X = []
y = []
file = open("../data/sentiment.json", mode='r')
# for d in json.loads(file.read()):
#     X.append([d['lat'], d['lng']])
#     if d['sentiment'] == '0.0':
#         y.append(1)
#         pass
#     elif float(d['sentiment']) > 0:
#         y.append(0)
#         pass
#     else:
#         y.append(1)
bos = json.loads(file.read())
for i in range(0, len(bos), 1):
    d = bos[i]
    X.append([d['lat'], d['lng']])
    if d['sentiment'] == '0.0':
        y.append(1)
        pass
    elif float(d['sentiment']) > 0:
        y.append(0)
        pass
    else:
        y.append(2)
file.close()

# we create an instance of SVM and fit out data. We do not scale our
# data since we want to plot the support vectors

svc = svm.SVC(kernel='linear', C=100, gamma='auto', decision_function_shape='ovr').fit(X, y)
# create a mesh to plot in
x_min, x_max = 0, 0
y_min, y_max = 0, 0
for d in X:
    if d == X[0] or d[0] > x_max:
        x_max = d[0]
        pass
    if d == X[0] or d[0] < x_min:
        x_min = d[0]
        pass
    if d == X[0] or d[1] > y_max:
        y_max = d[1]
        pass
    if d == X[0] or d[1] < y_min:
        y_min = d[1]
        pass
    pass
x_max += 40
x_min -= 40
y_max += 40
y_min -= 40
h = (x_max / x_min) / 10
print(len(np.arange(x_min, x_max, h)), len(np.arange(y_min, y_max, h)))
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
plt.subplot(1, 1, 1)
Z = svc.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)
plt.contourf(xx, yy, Z, cmap=plt.cm.Paired, alpha=0.8)
plt.scatter([x[0] for x in X], [x[1] for x in X], c=y, cmap=plt.cm.Paired)
plt.xlabel('x')
plt.ylabel('y')
plt.xlim(xx.min(), xx.max())
plt.title('SVC with linear kernel and C = 10')
plt.show()
