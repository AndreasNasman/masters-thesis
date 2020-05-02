import { DEFAULT_FILTER, getDirectoryName } from "./utils";
import { Filter, Metadata } from "api/metadata/types";
import {
  fetchMetadataPack,
  fetchMetadataPackSound,
  fetchMetadataPackSounds,
  fetchMetadataSearch
} from "api/metadata";

export const generateMetadataPack = async (
  pack: number
): Promise<{ directoryName: string; metadata: Metadata[] }> => {
  const { name: directoryName } = await fetchMetadataPack(pack);
  console.info(`📜  Fetching pack ${pack} '${directoryName}' metadata...`);

  const { results: sounds } = await fetchMetadataPackSounds(pack);

  const metadata: Metadata[] = [];
  for (const sound of sounds)
    metadata.push(await fetchMetadataPackSound(sound.id, directoryName));

  return { directoryName, metadata };
};

export const generateMetadataSearch = async (
  filter: Partial<Filter>
): Promise<{ directoryName: string; metadata: Metadata[] }> => {
  const directoryName = getDirectoryName(filter);
  console.info(`📜  Fetching '${directoryName}' metadata...`);

  const { results: metadata } = await fetchMetadataSearch({
    ...DEFAULT_FILTER,
    ...filter
  });

  return { directoryName, metadata };
};
