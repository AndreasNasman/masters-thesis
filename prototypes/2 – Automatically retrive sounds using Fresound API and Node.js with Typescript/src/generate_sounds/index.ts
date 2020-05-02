import {
  getDirectoryPath,
  getDownloadIndex,
  writeMetadataFile,
  writeSoundFile
} from "./utils";
import { Metadata } from "api/metadata/types";
import { fetchSound } from "api/sound";
import { promises as fs } from "fs";
const writeFile = async ({
  accessToken,
  directoryPath,
  metadataOnly,
  sound,
  text
}: {
  accessToken: string;
  directoryPath: string;
  metadataOnly: boolean;
  sound: Metadata;
  text: string;
}): Promise<void> => {
  try {
    await writeMetadataFile(sound, directoryPath);

    if (!metadataOnly) {
      const body = await fetchSound(sound.download, accessToken);
      await writeSoundFile(sound, body, directoryPath);
    }
  } catch (error) {
    console.error(`❌  ${text}`);
    throw error;
  }

  console.info(`✅  ${text}`);
};

const writeFiles = async ({
  accessToken,
  directoryName,
  metadataOnly,
  metadata
}: {
  accessToken: string;
  directoryName: string;
  metadata: Metadata[];
  metadataOnly: boolean;
}): Promise<void> => {
  console.info(`🖊   Writing '${directoryName}' sounds...`);

  const directoryPath = getDirectoryPath(directoryName);
  await fs.mkdir(directoryPath, { recursive: true });

  await Promise.all(
    metadata.map(async (sound, index) => {
      const { length } = metadata;
      const downloadNumber = `[${getDownloadIndex(index, length)}/${length}]`;
      const text = `${downloadNumber} '${directoryName}' sound – ${sound.name}`;

      await writeFile({
        accessToken,
        directoryPath,
        metadataOnly,
        sound,
        text
      });
    })
  );
};

export const generateSounds = async ({
  accessToken,
  directoryName,
  dry,
  metadata,
  metadataOnly
}: {
  accessToken: string;
  directoryName: string;
  dry: boolean;
  metadata: Metadata[];
  metadataOnly: boolean;
}): Promise<void> => {
  if (dry) {
    console.info(
      `🔊  ${metadata.length} '${directoryName}' sound(s) can be generated!\n`
    );
    return;
  } else if (metadata.length === 0) {
    console.info(`❗️  No '${directoryName}' sounds to generate!\n`);
    return;
  }

  await writeFiles({
    accessToken,
    directoryName,
    metadata,
    metadataOnly
  });

  console.info(`🔊  All '${directoryName}' sounds generated!\n`);
};
