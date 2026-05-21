export type Song = {
  id: string;
  title: string;
  artists: nameArtist[];
  album: string;
  albumId: string;
  artistId: string;
  playCount: number;
  genre: string;
  duration: number | null;
  coverArt: string | null;
};

export type nameArtist = {
  id: string;
  name: string;
};
