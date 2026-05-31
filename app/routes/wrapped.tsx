import type { Route } from "./+types/home";
import { WrappedCard } from "@/components/card";
import getTopAlbums from "@/lib/getTopAlbums";
import getSongs from "@/lib/getSongs";
import React from "react";
import type { Song } from "@/types/Song";
import type { Artist, IDArtist } from "@/types/Artist";
import type { Genre } from "@/types/Genre";
import type { Album } from "@/types/Album";
import { useLocation, useNavigate } from "react-router";
import generateDiff from "@/lib/generateDiff";
import nProgress from "nprogress";
import type { AuthData } from "@/types/AuthData";
import getArtists from "@/lib/getArtists";
import { getColorSync } from "colorthief";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Navidrome Wrapped | Wrapped",
      description: "Your Navidrome wrapped cards are on the way!",
    },
  ];
}

export default function Wrapped() {
  const navigate = useNavigate();

  const [topAlbums, setTopAlbums] = React.useState<Album[]>([]);
  const [topSongs, setTopSongs] = React.useState<Song[]>([]);
  const [topArtists, setTopArtists] = React.useState<Artist[]>([]);
  const [topGenre, setTopGenre] = React.useState<string>("");
  const [cover, setCover] = React.useState<string[]>(["", "", ""]);
  const [mainColor, setMainColor] = React.useState<string[]>(["", "", ""]);
  const [listenTime, setListenTime] = React.useState<number>(0);
  const [diff, setDiff] = React.useState<string>("");

  const hasLoaded = React.useRef(false);

  const location = useLocation();
  const { serverUrl, username, password } = location.state || {};

  const handleDiff = async () => {
    if (diff == "") return alert("No diff was generated yet");

    const blob = new Blob([diff], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = `navDiff-${new Date().getTime()}.wrapped`;
    link.click();
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    nProgress.start();

    async function load() {
      if (!serverUrl || !username || !password) {
        return navigate("/?error=true", {
          state: {
            error: "Missing Server URL/Username/Password",
          },
        });
      }

      let albums;
      try {
        albums = await getTopAlbums({
          server: serverUrl,
          username,
          password,
        });
      } catch (e) {
        return navigate("/?error=true", {
          state: {
            error:
              e instanceof Error ? e.message : "Failed to fetch top albums",
          },
        });
      }

      setTopAlbums(albums);

      let songs;
      const authdata: AuthData = { server: serverUrl, username, password };
      try {
        songs = await getSongs(authdata);
      } catch (e) {
        return navigate("/?error=true", {
          state: {
            error: e instanceof Error ? e.message : "Failed to fetch songs",
          },
        });
      }

      setTopSongs(songs.slice(0, 5));
      let time = 0;
      const genres: Genre[] = [];

      const [topArtists, artist]: [Artist[], IDArtist[]] = await getArtists(
        authdata,
        songs,
      );

      songs.forEach((song: Song) => {
        time += (song.duration ?? 0) * song.playCount;

        const songGenre = song.genre;
        if (songGenre) {
          let found = false;
          genres.forEach((genre: Genre) => {
            if (!found && genre.name.trim() == songGenre.trim()) {
              genre.occurencies += song.playCount;
              found = true;
            }
          });

          if (!found) {
            genres.push({ name: songGenre, occurencies: song.playCount });
          }
        }
      });

      const a = artist.sort(
        (a: IDArtist, b: IDArtist) => b.occurencies - a.occurencies,
      );
      genres.sort((a: Genre, b: Genre) => b.occurencies - a.occurencies);

      setTopArtists(topArtists);

      if (!genres[0]) {
        return navigate("/?error=true", {
          state: {
            error: "Missing data from server",
          },
        });
      }

      setTopGenre(genres[0].name);
      setListenTime(Math.round(time / 60));
      setDiff(await generateDiff(time, genres, a, songs, albums));

      const topArtist = a.slice(0, 1)[0];
      const topAlbum = albums.slice(0, 1)[0];
      const topSong = songs.slice(0, 1)[0];

      const url = new URL("/rest/getCoverArt", serverUrl);
      url.searchParams.set("u", username);
      url.searchParams.set("p", password);
      url.searchParams.set("v", "1.16.1");
      url.searchParams.set("c", "NavidromeWrapped");

      const covers = ["", "", ""];

      if (topArtist) {
        url.searchParams.set("id", topArtist.id);
        covers[0] = url.toString();
      }

      if (topAlbum) {
        url.searchParams.set("id", topAlbum.coverArt ?? topAlbum.id);
        covers[1] = url.toString();
      }

      if (topSong) {
        url.searchParams.set(
          "id",
          topSong.coverArt ?? topSong.id ?? topSong.albumId,
        );
        covers[2] = url.toString();
      }

      setCover(covers);
    }

    try {
      load();
    } catch (e) {
      navigate("/?error=true", {
        state: {
          error:
            e instanceof Error ? e.message : "An unexpected error occurred",
        },
      });
    }
  }, []);

  React.useEffect(() => {
    for (let i = 0; i < 3; i++) {
      if (mainColor[i] != "") continue;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = cover[i];

      img.onload = () => {
        try {
          const color: any = getColorSync(img);
          const hex =
            "#" +
            ((1 << 24) | (color[0] << 16) | (color[1] << 8) | color[2])
              .toString(16)
              .slice(1);

          setMainColor((prev) => {
            const next = [...prev];
            next[i] = hex;
            return next;
          });
        } catch (err) {
          console.log(err);
        }
      };
    }

    nProgress.done();
  }, [cover[0], cover[1], cover[2]]);

  const baseData = [
    {
      image: cover[0],
      topArtists: topArtists,
      topSongs: topSongs,
      minutesListened: listenTime,
      topGenre: topGenre,
      accentColor: mainColor[0],
    },
    {
      image: cover[1],
      topArtists: topArtists,
      topAlbums: topAlbums,
      minutesListened: listenTime,
      topGenre: topGenre,
      accentColor: mainColor[1],
    },
    {
      image: cover[2],
      topSongs: topSongs,
      topAlbums: topAlbums,
      minutesListened: listenTime,
      topGenre: topGenre,
      accentColor: mainColor[2],
    },
  ];

  const data = React.useMemo(() => {
    const d = [...baseData];
    for (let i = d.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      const temp = d[i];
      d[i] = d[j];
      d[j] = temp;
    }
    return d;
  }, [cover, topArtists, topSongs, topAlbums, listenTime, topGenre, mainColor]);

  if (topSongs.length === 0) {
    return <div id="loading">Loading your Navidrome Wrapped...</div>;
  }

  return (
    <div>
      <div id="wrappedOther">
        <h1>{username}'s Navidrome Wrapped</h1>
        <button onClick={handleDiff}>Download diff</button>
      </div>
      <div id="cardsContainer">
        {data.map((cardData, index) => {
          return <WrappedCard key={index} {...cardData} />;
        })}
      </div>
    </div>
  );
}
