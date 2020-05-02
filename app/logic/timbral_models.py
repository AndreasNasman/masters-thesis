from json import loads
from pathlib import Path
from uuid import uuid1

from timbral_models import timbral_extractor

timbral_characterstics = [
    "boominess",
    "brightness",
    "depth",
    "hardness",
    "roughness",
    "sharpness",
    "warmth",
]


def process_freesound_samples(directory):
  """Processes Freesound samples to a common format."""
  result = []
  relevant_properties = ["ac_analysis", "id", "name", "pack_name", "type"]

  paths = Path(directory).rglob("*.json")
  for path in paths:
    try:
      with open(path, "r") as reader:
        metadata = loads(reader.read())
        converted_metadata = {
            "path": str(path),
            "tag": "",
            "verified": False
        }

        for rp in relevant_properties:
          value = metadata[rp]

          if rp == "ac_analysis":
            for tc in timbral_characterstics:
              converted_metadata[tc] = value["ac_" + tc]
          else:
            converted_metadata[rp] = value

        result.append(converted_metadata)
    except:
      continue

  return result


def process_sounds(directory):
  """Processes sounds using AudioCommons Timbral Models."""
  result = []

  paths = Path(directory).rglob("*")
  for path in paths:
    try:
      path_str = str(path)
      sound = timbral_extractor(path_str, clip_output=True)
      del sound["reverb"]

      sound["id"] = uuid1().hex
      sound["name"] = Path(path_str).resolve().stem
      sound["pack_name"] = ""
      sound["path"] = path_str
      sound["tag"] = ""
      sound["type"] = Path(path_str).suffix.replace(".", "")
      sound["verified"] = False

      result.append(sound)
    except:
      continue

  return result
