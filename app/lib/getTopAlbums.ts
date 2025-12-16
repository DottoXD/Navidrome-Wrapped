import type { Album } from "@/types/Album";
import type { AuthData } from "@/types/AuthData";

export default async function getTopAlbums(authData: AuthData) {
  const parsedAlbum = (album: Album) => ({
    id: album.id,
    name: album.name,
    artist: album.displayArtist || album.artist,
    playCount: album.playCount ?? 0,
    coverArt: album.coverArt ?? null,
    played: album.played ? new Date(album.played) : null,
    year: album.year ?? null,
    genre: album.genre ?? null,
  });

  const url = new URL("/rest/getAlbumList2", authData.server);
  url.searchParams.set("type", "frequent");
  url.searchParams.set("size", "5");
  url.searchParams.set("u", authData.username);
  url.searchParams.set("p", authData.password);
  url.searchParams.set("v", "1.16.1");
  url.searchParams.set("c", "NavidromeWrapped");
  url.searchParams.set("f", "json");

  const res = await fetch(url);
  const json = await res.json();

  const albumsRaw = json["subsonic-response"]?.albumList2?.album || [];
  const albums = albumsRaw.map(parsedAlbum);

  return albums;
}
