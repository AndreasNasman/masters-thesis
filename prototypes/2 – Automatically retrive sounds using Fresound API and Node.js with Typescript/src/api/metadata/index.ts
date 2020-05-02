import {
  Filter,
  ResponsePack,
  ResponsePackSound,
  ResponsePackSounds,
  ResponseSearch
} from "./types";
import {
  constructURLPack,
  constructURLPackSounds,
  constructURLSearch,
  constructURLSound
} from "./utils";
import { clientSecret } from "api/config";
import fetch from "node-fetch";

export const fetchMetadataPack = async (
  pack: number
): Promise<ResponsePack> => {
  const url = constructURLPack(pack);
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${clientSecret}`
    }
  });

  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);

  const json: ResponsePack = await response.json();

  return json;
};

export const fetchMetadataPackSound = async (
  soundId: number,
  packName: string
): Promise<ResponsePackSound> => {
  const url = constructURLSound(soundId);
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${clientSecret}`
    }
  });

  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);

  const json: ResponsePackSound = await response.json();
  json.pack_name = packName; // eslint-disable-line @typescript-eslint/camelcase

  return json;
};

export const fetchMetadataPackSounds = async (
  pack: number
): Promise<ResponsePackSounds> => {
  const url = constructURLPackSounds(pack);
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${clientSecret}`
    }
  });

  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);

  const json: ResponsePackSounds = await response.json();

  return json;
};

export const fetchMetadataSearch = async (
  filter: Filter
): Promise<ResponseSearch> => {
  const url = constructURLSearch(filter);

  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${clientSecret}`
    }
  });

  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);

  const json: ResponseSearch = await response.json();

  return json;
};
