export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  artistId: string;
  playCount: number;
  genre: string;
  duration: number | null;
  coverArt: string | null;
};
