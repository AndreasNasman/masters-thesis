import { Filter, LIMIT_VALUE_MAXIMUM, Limit } from "api/metadata/types";
import { DEFAULT_LIMIT } from "filter/utils";

/* eslint-disable @typescript-eslint/camelcase */
export const DEFAULT_FILTER: Filter = {
  ac_boominess: DEFAULT_LIMIT,
  ac_brightness: DEFAULT_LIMIT,
  ac_depth: DEFAULT_LIMIT,
  ac_hardness: DEFAULT_LIMIT,
  ac_roughness: DEFAULT_LIMIT,
  ac_sharpness: DEFAULT_LIMIT,
  ac_warmth: DEFAULT_LIMIT
};
/* eslint-enable @typescript-eslint/camelcase */

const LEVELS = ["LOWEST", "LOW", "MID", "HIGH", "HIGHEST"];
const NUMBER_OF_VALUES = LIMIT_VALUE_MAXIMUM + 1;

const getLevel = (limit?: Limit): string => {
  if (!limit) throw new Error("Limit cannot be empty.");

  const { max, min } = limit;

  const start = Math.floor(min / (NUMBER_OF_VALUES / LEVELS.length));
  const end = Math.floor(max / (NUMBER_OF_VALUES / LEVELS.length));

  return LEVELS.slice(start, end + 1).join("+");
};

export const getDirectoryName = (filter: Partial<Filter>): string =>
  Object.entries(filter)
    .map(
      ([timbralCharacteristic, limit]: [string, Limit | undefined]) =>
        `${timbralCharacteristic}-${getLevel(limit)}`
    )
    .join(",");
