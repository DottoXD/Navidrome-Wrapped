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
import generateDiff, {
  subtractDiff,
} from "@/lib/generateDiff";
import nProgress from "nprogress";
import type { AuthData } from "@/types/AuthData";
import getArtists from "@/lib/getArtists";
import type { WrappedDiff } from "@/types/WrappedDiff";

export function meta({ }: Route.MetaArgs) {
  return [
    {
      title: "Navidrome Wrapped | Wrapped",
      description: "Your Navidrome wrapped cards are on the way!",
    },
    {
      name: "description",
      content: "Your Navidrome wrapped cards are on the way!",
    },
    { property: "og:title", content: "Navidrome Wrapped | Navidrome Recap" },
    {
      property: "og:description",
      content: "Your Navidrome wrapped cards are on the way!",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://wrapped.dotto.pw" },
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
  const [periodLabel, setPeriodLabel] = React.useState<string>("");

  const hasLoaded = React.useRef(false);

  const location = useLocation();
  const { serverUrl, username, password, prevDiff } = (location.state ||
    {}) as {
      serverUrl: string;
      username: string;
      password: string;
      prevDiff: WrappedDiff | null;
    };

  const handleDiff = async () => {
    if (diff === "") return alert("No diff was generated yet!");

    const blob = new Blob([diff], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = `navDiff-${Date.now()}.wrapped`;
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
          state: { error: "Missing Server URL/Username/Password" },
        });
      }

      let albums: Album[];
      try {
        albums = await getTopAlbums({ server: serverUrl, username, password });
      } catch (e) {
        return navigate("/?error=true", {
          state: {
            error:
              e instanceof Error ? e.message : "Failed to fetch top albums!",
          },
        });
      }

      const authdata: AuthData = { server: serverUrl, username, password };

      let rawSongs: Song[];
      try {
        rawSongs = await getSongs(authdata);
      } catch (e) {
        return navigate("/?error=true", {
          state: {
            error: e instanceof Error ? e.message : "Failed to fetch songs",
          },
        });
      }

      const rawGenres: Genre[] = [];
      const rawArtistMap = new Map<string, number>();

      rawSongs.forEach((song) => {
        if (song.genre) {
          const existing = rawGenres.find(
            (g) => g.name.trim() === song.genre!.trim(),
          );
          if (existing) existing.occurencies += song.playCount;
          else
            rawGenres.push({ name: song.genre, occurencies: song.playCount });
        }
        const prev = rawArtistMap.get(song.artistId) ?? 0;
        rawArtistMap.set(song.artistId, prev + song.playCount);
      });

      const rawArtists: IDArtist[] = [...rawArtistMap.entries()]
        .map(([id, occurencies]) => ({ id, occurencies }))
        .sort((a, b) => b.occurencies - a.occurencies);

      const rawListenTime = rawSongs.reduce(
        (sum, s) => sum + (s.duration ?? 0) * s.playCount,
        0,
      );

      setDiff(
        await generateDiff(
          rawListenTime,
          rawGenres,
          rawArtists,
          rawSongs,
          albums,
        ),
      );

      const effectiveSongs = prevDiff
        ? subtractDiff(rawSongs, prevDiff)
        : rawSongs;

      if (effectiveSongs.length === 0) {
        return navigate("/?error=true", {
          state: {
            error:
              "No new plays found since your last diff. Listen to more music and try again!",
          },
        });
      }

      if (prevDiff) {
        const from = new Date(prevDiff.diffTime).getFullYear();
        const to = new Date().getFullYear();
        setPeriodLabel(from === to ? `${from}` : `${from}–${to}`);
      } else {
        setPeriodLabel(String(new Date().getFullYear()));
      }

      const sortedSongs = [...effectiveSongs].sort(
        (a, b) => b.playCount - a.playCount,
      );

      setTopSongs(sortedSongs.slice(0, 5));

      let time = 0;
      const genres: Genre[] = [];

      sortedSongs.forEach((song) => {
        time += (song.duration ?? 0) * song.playCount;

        const songGenre = song.genre;
        if (songGenre) {
          const existing = genres.find(
            (g) => g.name.trim() === songGenre.trim(),
          );
          if (existing) existing.occurencies += song.playCount;
          else genres.push({ name: songGenre, occurencies: song.playCount });
        }
      });

      genres.sort((a, b) => b.occurencies - a.occurencies);

      const [topArtistsList, sortedIDartists] = await getArtists(
        authdata,
        sortedSongs,
      );
      setTopArtists(topArtistsList);

      if (!genres[0]) {
        return navigate("/?error=true", {
          state: { error: "Missing data from server" },
        });
      }

      setTopGenre(genres[0].name);
      setListenTime(Math.round(time / 60));

      let effectiveAlbums = albums;
      if (prevDiff) {
        const albumPlayDeltas = new Map<string, number>();
        sortedSongs.forEach((song) => {
          const id = song.albumId;
          albumPlayDeltas.set(
            id,
            (albumPlayDeltas.get(id) ?? 0) + song.playCount,
          );
        });

        effectiveAlbums = [...albums]
          .map((album) => ({
            ...album,
            playCount: albumPlayDeltas.get(album.id) ?? 0,
          }))
          .sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0))
          .filter((a) => (a.playCount ?? 0) > 0);

        if (effectiveAlbums.length === 0) effectiveAlbums = albums;
      }

      setTopAlbums(effectiveAlbums.slice(0, 5));

      const topArtist = sortedIDartists[0];
      const topAlbum = effectiveAlbums[0];
      const topSong = sortedSongs[0];

      const coverUrl = new URL("/rest/getCoverArt", serverUrl);
      coverUrl.searchParams.set("u", username);
      coverUrl.searchParams.set("p", password);
      coverUrl.searchParams.set("v", "1.16.1");
      coverUrl.searchParams.set("c", "NavidromeWrapped");

      const covers: string[] = ["", "", ""];

      if (topArtist) {
        coverUrl.searchParams.set("id", topArtist.id);
        covers[0] = coverUrl.toString();
      }

      if (topAlbum) {
        coverUrl.searchParams.set("id", topAlbum.coverArt ?? topAlbum.id);
        covers[1] = coverUrl.toString();
      }

      if (topSong) {
        coverUrl.searchParams.set(
          "id",
          topSong.coverArt ?? topSong.albumId ?? topSong.id,
        );
        covers[2] = coverUrl.toString();
      }

      setCover(covers);
    }

    load().catch((e) => {
      navigate("/?error=true", {
        state: {
          error:
            e instanceof Error ? e.message : "An unexpected error occurred",
        },
      });
    });
  }, []);

  React.useEffect(() => {
    for (let i = 0; i < 3; i++) {
      if (mainColor[i] !== "") continue;
      if (!cover[i]) continue;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = cover[i];

      img.onload = async () => {
        try {
          const { getColorSync } = await import("colorthief");
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
      topArtists,
      topSongs,
      minutesListened: listenTime,
      topGenre,
      accentColor: mainColor[0],
    },
    {
      image: cover[1],
      topArtists,
      topAlbums,
      minutesListened: listenTime,
      topGenre,
      accentColor: mainColor[1],
    },
    {
      image: cover[2],
      topSongs,
      topAlbums,
      minutesListened: listenTime,
      topGenre,
      accentColor: mainColor[2],
    },
  ];

  const data = React.useMemo(() => {
    const d = [...baseData];
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
  }, [cover, topArtists, topSongs, topAlbums, listenTime, topGenre, mainColor]);

  if (topSongs.length === 0) {
    return <div id="loading">Loading your Navidrome Wrapped...</div>;
  }

  return (
    <div>
      <div id="wrappedOther">
        <h1>
          {username}'s {periodLabel} Wrapped
        </h1>
        <button onClick={handleDiff}>Download diff</button>
      </div>
      <div id="cardsContainer">
        {data.map((cardData, index) => (
          <WrappedCard key={index} {...cardData} />
        ))}
      </div>
    </div>
  );
}
