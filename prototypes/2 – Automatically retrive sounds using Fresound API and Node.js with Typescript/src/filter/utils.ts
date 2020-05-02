import {
  Filter,
  LIMIT_VALUE_MAXIMUM,
  LIMIT_VALUE_MINIMUM,
  Limit
} from "api/metadata/types";
import { PartialFilter } from "./types";

export const DEFAULT_LIMIT: Limit = { max: 100, min: 0 };

const validateLimit = (limit: Limit): Limit => {
  const { max, min } = limit;

  if (
    max < LIMIT_VALUE_MINIMUM ||
    min < LIMIT_VALUE_MINIMUM ||
    max > LIMIT_VALUE_MAXIMUM ||
    min > LIMIT_VALUE_MAXIMUM
  )
    throw new Error("Limit out of bounds.");

  if (max < min) throw new Error("Overlapping limit.");

  return limit;
};

export const validateFilters = (
  filters: PartialFilter[]
): Partial<Filter>[] => {
  if (!filters.length) throw new Error("No filters provided.");

  return filters.map(filter => {
    if (!Object.keys(filter).length) throw new Error("Filter cannot be empty.");

    return Object.entries(filter).reduce<Partial<Filter>>(
      (previousValue, [timbralCharacteristic, limit]) => ({
        ...previousValue,
        [timbralCharacteristic]: validateLimit({ ...DEFAULT_LIMIT, ...limit })
      }),
      {}
    );
  });
};
