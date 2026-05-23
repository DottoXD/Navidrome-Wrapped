import type { Artist, IDArtist } from "@/types/Artist";
import type { Song } from "@/types/Song";
import type { AuthData } from "@/types/AuthData";

export default async function getArtists(authData: AuthData, songs: Song[]): Promise<[Artist[], IDArtist[]]> {
    let listIDartist: IDArtist[] = []

    songs.forEach((song: Song) => {
        let found = false;
        listIDartist.forEach((IDartist: IDArtist) => {
            if (!found && song.artistId.trim() == IDartist.id.trim()) {
                IDartist.occurencies += song.playCount
                found = true
            }
        })
        if (!found) {
            listIDartist.push({
                id: song.artistId,
                occurencies: song.playCount
            })
        }
    })

    listIDartist = listIDartist.sort((a: IDArtist, b: IDArtist) => b.occurencies - a.occurencies)

    const topIDArtists = listIDartist.slice(0, 5)

    const artists = await Promise.all(
        topIDArtists.map(async (IDartist: IDArtist) => {
            const artistName = await getArtistsName(IDartist.id, authData)
            return {
                id: IDartist.id,
                name: artistName,
                occurencies: IDartist.occurencies
            } as Artist
        })
    )

    console.log(listIDartist);


    return [artists, listIDartist]
}

async function getArtistsName(ID: string, authData: AuthData): Promise<string> {

    const url = new URL("/rest/getArtist", authData.server);
    url.searchParams.set("u", authData.username);
    url.searchParams.set("p", authData.password);
    url.searchParams.set("v", "1.16.1");
    url.searchParams.set("c", "NavidromeWrapped");
    url.searchParams.set("f", "json");
    url.searchParams.set("id", ID);
    url.searchParams.set("count", "0")

    const res = await fetch(url);
    const json = await res.json();

    const artistRaw = json["subsonic-response"]?.artist?.name ?? ""

    return artistRaw

}