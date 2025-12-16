import type { AuthData } from "@/types/AuthData";
import type { Song } from "@/types/Song";

export default async function getSongs(authData: AuthData) {
  const parsedSong = (song: Song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    albumId: song.albumId,
    artistId: song.artistId,
    playCount: song.playCount ?? 0,
    genre: song.genre,
    duration: song.duration ?? null,
    coverArt: song.coverArt ?? null,
  });

  const url = new URL("/rest/search3", authData.server);
  url.searchParams.set("query", "");
  url.searchParams.set("songCount", "5000");
  url.searchParams.set("u", authData.username);
  url.searchParams.set("p", authData.password);
  url.searchParams.set("v", "1.16.1");
  url.searchParams.set("c", "NavidromeWrapped");
  url.searchParams.set("f", "json");

  const res = await fetch(url);
  const json = await res.json();

  const songsRaw = json["subsonic-response"]?.searchResult3?.song ?? [];

  const sorted = songsRaw
    .map(parsedSong)
    .sort((a: Song, b: Song) => b.playCount - a.playCount);

  return sorted;
}
