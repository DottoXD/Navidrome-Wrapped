import type { Album } from "@/types/Album";
import type { IDArtist } from "@/types/Artist";
import type { Genre } from "@/types/Genre";
import type { Song } from "@/types/Song";

export default async function generateDiff(
  listenTime: number,
  genres: Genre[],
  artists: IDArtist[],
  songs: Song[],
  albums: Album[],
) {
  return JSON.stringify({
    diffTime: new Date().getTime(),
    listenTime,
    genres,
    artists,
    songs,
    albums,
  });
}
