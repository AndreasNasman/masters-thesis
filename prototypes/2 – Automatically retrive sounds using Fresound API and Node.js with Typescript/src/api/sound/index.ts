import fetch from "node-fetch";

export const fetchSound = async (
  url: string,
  accessToken: string
): Promise<NodeJS.ReadableStream> => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);

  const { body } = response;

  return body;
};
