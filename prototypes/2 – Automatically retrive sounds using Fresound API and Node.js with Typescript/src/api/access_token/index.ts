/* eslint-disable @typescript-eslint/camelcase */
import { URL, URLSearchParams } from "url";
import { clientId, clientSecret } from "api/config";
import { OAuth2 } from "./types";
import fetch from "node-fetch";
import { promises as fs } from "fs";
import { join } from "path";

export const fetchAccessToken = async (): Promise<string> => {
  const filePath = join(__dirname, "refresh-token.txt");
  let refreshToken = await fs.readFile(filePath, { encoding: "utf-8" });
  refreshToken = refreshToken.toString();

  const url = new URL("https://freesound.org/apiv2/oauth2/access_token/");
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });

  const response = await fetch(url, {
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);

  const json = await response.json();
  const { access_token, refresh_token: newRefreshToken }: OAuth2 = json;

  await fs.writeFile(filePath, newRefreshToken, { encoding: "utf-8" });

  return access_token;
};
