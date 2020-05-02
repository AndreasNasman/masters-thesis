import { createWriteStream, promises as fs } from "fs";
import { Metadata } from "api/metadata/types";
import { join } from "path";
import stream from "stream";
import util from "util";

const pipeline = util.promisify(stream.pipeline);

const PRECEDING_ZERO_THRESHOLD = 9;

export const getDirectoryPath = (directoryName: string): string =>
  join(process.env.INIT_CWD || process.cwd(), "sounds", directoryName);

export const getDownloadIndex = (index: number, size: number): string => {
  const downloadIndex = index + 1;

  if (
    downloadIndex <= PRECEDING_ZERO_THRESHOLD &&
    size > PRECEDING_ZERO_THRESHOLD
  )
    return `0${downloadIndex}`;

  return `${downloadIndex}`;
};

const getFileName = (id: number, name: string): string =>
  `${id} – ${name.replace(/\//gu, "|")}`;

export const writeMetadataFile = async (
  sound: Metadata,
  directoryPath: string
): Promise<void> => {
  sound.pack_name = sound.pack_name || ""; // eslint-disable-line @typescript-eslint/camelcase
  const { id, name } = sound;
  await fs.writeFile(
    join(directoryPath, `${getFileName(id, name)}.json`),
    JSON.stringify(sound)
  );
};

export const writeSoundFile = async (
  { id, name, type }: Metadata,
  body: NodeJS.ReadableStream,
  directoryPath: string
): Promise<void> => {
  await pipeline(
    body,
    createWriteStream(join(directoryPath, `${getFileName(id, name)}.${type}`))
  );
};
