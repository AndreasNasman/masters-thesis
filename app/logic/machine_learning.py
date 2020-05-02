from copy import deepcopy

import numpy
from sklearn.cluster import KMeans, MeanShift

from logic.timbral_models import timbral_characterstics


def build_X(sounds):
  """Builds X, i.e. coordinates for all samples' features."""
  X = []

  for sound in sounds:
    x = []
    for tc in timbral_characterstics:
      x.append(sound[tc])
    X.append(x)

  return X


def find_groups(sounds, X, centroids):
  """Finds groups of sound using K means."""
  k = len(centroids)
  km = KMeans(init=centroids, n_clusters=k, n_init=1).fit(X)

  updated_sounds = deepcopy(sounds)
  for sound, group in zip(updated_sounds, km.labels_):
    sound["group"] = int(group)

  updated_centroids = km.cluster_centers_.tolist()
  updated_centroids.sort()

  return updated_sounds, updated_centroids


def init_groups(sounds, X):
  """Searches for initial groups of sound using Mean shift."""
  ms = MeanShift().fit(X)
  centroids = ms.cluster_centers_.tolist()
  centroids.sort()

  return find_groups(sounds, X, numpy.array(centroids))


def add_group(sounds, X, centroids, modified_sound):
  """Adds a new group of sound."""
  new_centroid = []
  for tc in timbral_characterstics:
    new_centroid.append(modified_sound[tc])

  new_centroids = deepcopy(centroids)
  new_centroids.append(new_centroid)
  new_centroids.sort()

  return find_groups(sounds, X, numpy.array(new_centroids))


def modify_groups(sounds, X, centroids, modified_sound, tag, db_sounds):
  """Modifies groups until sounds have their associated tag."""
  updated_sounds, updated_centroids = add_group(
      sounds, X, centroids, modified_sound)

  # Finds the new group.
  for updated_sound in updated_sounds:
    if updated_sound["id"] == modified_sound["id"]:
      new_group = updated_sound["group"]
      break

  # Tags sounds in the new group.
  for updated_sound in updated_sounds:
    if updated_sound["group"] == new_group:
      updated_sound["tag"] = tag

  # Checks that all verified sounds kept their tag.
  for db_sound, updated_sound in zip(db_sounds, updated_sounds):
    if (db_sound["verified"] and
        db_sound["tag"] != updated_sound["tag"] and
            db_sound["id"] != modified_sound["id"]):
      return modify_groups(updated_sounds, X, updated_centroids,
                           db_sound, db_sound["tag"], db_sounds)

  return updated_sounds, updated_centroids


def sort_sounds(sounds):
  """Sounds need to be sorted for some of the logic to work correctly."""
  updated_sounds = sorted(sounds, key=lambda s: (s["group"], not s["tag"]))
  updated_X = build_X(updated_sounds)

  return updated_sounds, updated_X


def review_groups(sounds, X, centroids):
  """Makes sure that there is only one tag per group."""
  updated_sounds, updated_X = sort_sounds(sounds)
  updated_centroids = centroids

  for a, b in zip(updated_sounds, updated_sounds[1:]):
    if (a["group"] == b["group"] and a["tag"] != b["tag"]
            and a["tag"] and b["tag"]):
      updated_sounds, updated_centroids = add_group(
          updated_sounds, updated_X, updated_centroids, b)
      return review_groups(
          updated_sounds, updated_X, updated_centroids)

  return updated_sounds, X, updated_centroids


def tag_groups(sounds):
  """Tags sounds that are missing a group's tag."""
  updated_sounds, updated_X = sort_sounds(sounds)

  for a, b in zip(updated_sounds, updated_sounds[1:]):
    if a["group"] == b["group"] and a["tag"] and not b["tag"]:
      b["tag"] = a["tag"]

  return updated_sounds, updated_X
