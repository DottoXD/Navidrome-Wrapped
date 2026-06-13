import type { Album } from "./Album";
import type { IDArtist } from "./Artist";
import type { Genre } from "./Genre";
import type { Song } from "./Song";

export type WrappedDiff = {
  version: number;
  diffTime: number;
  listenTime: number;
  genres: Genre[];
  artists: IDArtist[];
  songs: Pick<
    Song,
    | "id"
    | "title"
    | "artistId"
    | "albumId"
    | "genre"
    | "duration"
    | "coverArt"
    | "playCount"
  >[];
  albums: Album[];
};
