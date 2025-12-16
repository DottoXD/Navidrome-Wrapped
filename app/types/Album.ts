export type Album = {
  id: string;
  name: string;
  displayArtist: string | null;
  artist: string;
  playCount: number;
  coverArt: string | null;
  played: Date | null;
  year: number | null;
  genre: string | null;
};
