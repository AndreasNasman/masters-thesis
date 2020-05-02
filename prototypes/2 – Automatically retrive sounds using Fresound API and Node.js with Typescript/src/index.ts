import {
  generateMetadataPack,
  generateMetadataSearch
} from "generate_metadata";
import { getConsoleText, sleep } from "utils";
import { fetchAccessToken } from "api/access_token";
import { generateSounds } from "generate_sounds";
import { getFilters } from "filter";
import yargs from "yargs";

/* eslint-disable id-length */
const args = yargs
  .options({
    d: { default: false, type: "boolean" },
    m: { default: false, type: "boolean" },
    p: { default: 0, type: "number" }
  })
  .alias({ d: "dry" })
  .alias({ m: "metadata-only" })
  .alias({ p: "pack" }).argv;
const { d: dry, m: metadataOnly, p: pack } = args;
/* eslint-enable id-length */

(async (): Promise<void> => {
  const consoleText = getConsoleText(dry, metadataOnly, pack);

  console.info(`${consoleText.start}\n\n`);

  try {
    const accessToken = await fetchAccessToken();

    if (pack > 0) {
      const { directoryName, metadata } = await generateMetadataPack(pack);
      await generateSounds({
        accessToken,
        directoryName,
        dry,
        metadata,
        metadataOnly
      });
    } else {
      for (const filter of getFilters()) {
        const { directoryName, metadata } = await generateMetadataSearch(
          filter
        );
        await generateSounds({
          accessToken,
          directoryName,
          dry,
          metadata,
          metadataOnly
        });

        await sleep();
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }

  console.info(`\n${consoleText.finish}`);
})();
