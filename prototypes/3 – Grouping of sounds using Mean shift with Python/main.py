import json
import os
import sys
from pathlib import Path

from sklearn.cluster import MeanShift

timbral_characterstics = [
    'ac_boominess',
    'ac_brightness',
    'ac_depth',
    'ac_hardness',
    'ac_roughness',
    'ac_sharpness',
    'ac_warmth',
]

ids = []
X = []

pathlist = Path().glob('./sounds/**/*.json')
for path in pathlist:
    path_str = str(path)
    with open(path_str, 'r') as reader:
        sound_metadata = json.loads(reader.read())

        id = sound_metadata['id']
        ids.append(id)

        features = []
        for tc in timbral_characterstics:
            features.append(sound_metadata['ac_analysis'][tc])
        X.append(features)

ms = MeanShift().fit(X)

for c in range(0, len(ms.cluster_centers_)):
    print('Cluster ', c)
    ids_in_cluster = []
    for index, label in enumerate(ms.labels_):
        if label == c:
            ids_in_cluster.append(ids[index])
    print(sorted(ids_in_cluster), '\n')
