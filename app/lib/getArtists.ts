import type { Artist, IDArtist } from "@/types/Artist";
import type { AuthData } from "@/types/AuthData";
import type { Song } from "@/types/Song";
import { getArtistsName } from "./getArtistsName";

export default async function getArtists(
  authData: AuthData,
  songs: Song[],
): Promise<[Artist[], IDArtist[]]> {
  let listIDartist: IDArtist[] = [];

  songs.forEach((song: Song) => {
    let found = false;
    listIDartist.forEach((IDartist: IDArtist) => {
      if (!found && song.artistId.trim() == IDartist.id.trim()) {
        IDartist.occurencies += song.playCount;
        found = true;
      }
    });
    if (!found) {
      listIDartist.push({
        id: song.artistId,
        occurencies: song.playCount,
      });
    }
  });

  listIDartist = listIDartist.sort(
    (a: IDArtist, b: IDArtist) => b.occurencies - a.occurencies,
  );

  const topIDArtists = listIDartist.slice(0, 5);

  const artists = await Promise.all(
    topIDArtists.map(async (IDartist: IDArtist) => {
      const artistName = await getArtistsName(IDartist.id, authData);
      return {
        id: IDartist.id,
        name: artistName,
        occurencies: IDartist.occurencies,
      } as Artist;
    }),
  );

  console.log(listIDartist);

  return [artists, listIDartist];
}
