const THROTTLE = 1000;

export const getConsoleText = (
  dry: boolean,
  metadataOnly: boolean,
  pack: number
): { finish: string; start: string } => {
  const icons = [
    dry ? "🌵" : "",
    metadataOnly ? "📜" : "",
    pack ? "📦" : ""
  ].filter(Boolean);

  let text = [
    dry ? "dry" : "",
    metadataOnly ? "metadata only" : "",
    pack ? "pack" : "",
    "sound generation"
  ]
    .filter(Boolean)
    .join(" ");

  text = text.charAt(0).toUpperCase() + text.slice(1);

  return {
    finish: `${[...icons, "🏁"].join(" ")}  ${text} finished!`,
    start: `${[...icons, "🥁"].join(" ")}  ${text} started...`
  };
};

export const sleep = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, THROTTLE));
