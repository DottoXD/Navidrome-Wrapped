import type { AuthData } from "@/types/AuthData";

export async function getArtistsName(
  ID: string,
  authData: AuthData,
): Promise<string> {
  const url = new URL("/rest/getArtist", authData.server);
  url.searchParams.set("u", authData.username);
  url.searchParams.set("p", authData.password);
  url.searchParams.set("v", "1.16.1");
  url.searchParams.set("c", "NavidromeWrapped");
  url.searchParams.set("f", "json");
  url.searchParams.set("id", ID);
  url.searchParams.set("count", "0");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "NavidromeWrapped",
    },
  });
  const json = await res.json();

  const artistRaw = json["subsonic-response"]?.artist?.name ?? "";

  return artistRaw;
}
