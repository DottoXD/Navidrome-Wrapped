import type { Album } from "@/types/Album";
import type { IDArtist } from "@/types/Artist";
import type { Genre } from "@/types/Genre";
import type { Song } from "@/types/Song";
import type { WrappedDiff } from "@/types/WrappedDiff";

export default async function generateDiff(
  listenTime: number,
  genres: Genre[],
  artists: IDArtist[],
  songs: Song[],
  albums: Album[],
): Promise<string> {
  const diff: WrappedDiff = {
    version: 1,
    diffTime: Date.now(),
    listenTime,
    genres,
    artists,
    songs: songs.map((s) => ({
      id: s.id,
      title: s.title,
      artistId: s.artistId,
      albumId: s.albumId,
      genre: s.genre,
      duration: s.duration,
      coverArt: s.coverArt,
      playCount: s.playCount,
    })),
    albums,
  };

  return JSON.stringify(diff);
}

export function subtractDiff(
  currentSongs: Song[],
  prevDiff: WrappedDiff,
): Song[] {
  const prevPlayCounts = new Map<string, number>();
  for (const s of prevDiff.songs) {
    prevPlayCounts.set(s.id, s.playCount ?? 0);
  }

  return currentSongs
    .map((song) => {
      const prev = prevPlayCounts.get(song.id) ?? 0;
      const delta = (song.playCount ?? 0) - prev;
      return { ...song, playCount: Math.max(0, delta) };
    })
    .filter((song) => song.playCount > 0);
}
