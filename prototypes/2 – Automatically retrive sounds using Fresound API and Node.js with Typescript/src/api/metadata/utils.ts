/* eslint-disable @typescript-eslint/camelcase */
import { URL, URLSearchParams } from "url";
import { Filter } from "./types";

const FIELDS = ["id", "name", "type", "download", "ac_analysis"];

export const constructURLPack = (pack: number): URL =>
  new URL(`https://freesound.org/apiv2/packs/${pack}/`);

export const constructURLPackSounds = (pack: number): URL => {
  const url = new URL(`https://freesound.org/apiv2/packs/${pack}/sounds/`);
  const params = new URLSearchParams({
    fields: ["id"]
  });

  url.search = params.toString();

  return url;
};

export const constructURLSearch = ({
  ac_boominess,
  ac_brightness,
  ac_depth,
  ac_hardness,
  ac_roughness,
  ac_sharpness,
  ac_warmth
}: Filter): URL => {
  const url = new URL(`https://freesound.org/apiv2/search/text/`);
  const params = new URLSearchParams({
    fields: FIELDS,
    filter: [
      `ac_boominess:[${ac_boominess.min} TO ${ac_boominess.max}]`,
      `ac_brightness:[${ac_brightness.min} TO ${ac_brightness.max}]`,
      `ac_depth:[${ac_depth.min} TO ${ac_depth.max}]`,
      `ac_hardness:[${ac_hardness.min} TO ${ac_hardness.max}]`,
      `ac_roughness:[${ac_roughness.min} TO ${ac_roughness.max}]`,
      `ac_sharpness:[${ac_sharpness.min} TO ${ac_sharpness.max}]`,
      `ac_warmth:[${ac_warmth.min} TO ${ac_warmth.max}]`
    ].join(" ")
  });

  url.search = params.toString();

  return url;
};

export const constructURLSound = (soundId: number): URL => {
  const url = new URL(`https://freesound.org/apiv2/sounds/${soundId}/`);
  const params = new URLSearchParams({
    fields: FIELDS
  });

  url.search = params.toString();

  return url;
};
