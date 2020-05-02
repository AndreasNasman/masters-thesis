import { Filter, Limit } from "api/metadata/types";

export type PartialFilter = Partial<
  {
    [key in keyof Filter]: Partial<Limit>;
  }
>;
