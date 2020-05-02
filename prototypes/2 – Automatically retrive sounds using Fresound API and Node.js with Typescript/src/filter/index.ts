/* eslint-disable @typescript-eslint/camelcase */
import { Filter } from "api/metadata/types";
import { PartialFilter } from "./types";
import { validateFilters } from "./utils";

const filters: PartialFilter[] = [
  { ac_boominess: { min: 69 } },
  { ac_boominess: { max: 0 } },
  { ac_brightness: { min: 97 } },
  { ac_brightness: { max: 0 } },
  { ac_depth: { min: 100 } },
  { ac_depth: { max: 0 } },
  { ac_hardness: { min: 99 } },
  { ac_hardness: { max: 0 } },
  { ac_roughness: { min: 93 } },
  { ac_roughness: { max: 22 } },
  { ac_sharpness: { min: 100 } },
  { ac_sharpness: { max: 0 } },
  { ac_warmth: { min: 75 } },
  { ac_warmth: { max: 9 } }
];

export const getFilters = (): Partial<Filter>[] => validateFilters(filters);
