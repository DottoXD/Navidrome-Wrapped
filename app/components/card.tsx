import { FaMusic } from "react-icons/fa";
import type { Artist } from "@/types/Artist";
import type { Song } from "@/types/Song";
import type { Album } from "@/types/Album";
import React from "react";
import html2canvas from "html2canvas";

const patterns = ["star", "topography", "falling-triangles", "brick-wall"];
const patternSizes = ["1.1rem", "15rem", "1.05rem", "2rem"];

export const WrappedCard = ({
  image,
  topArtists,
  topSongs,
  topAlbums,
  minutesListened,
  topGenre,
  accentColor,
}: {
  image: string;
  topArtists?: Artist[];
  topSongs?: Song[];
  topAlbums?: Album[];
  minutesListened: number;
  topGenre: string;
  accentColor: string;
}) => {
  if (!image || !accentColor) return <div></div>;

  const rgbAccentColor = parseInt(accentColor.substring(1), 16);
  const r = (rgbAccentColor >> 16) & 0xff,
    g = (rgbAccentColor >> 8) & 0xff,
    b = (rgbAccentColor >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let dark = Math.round(Math.random()) && luma > 60 ? " dark" : "";
  if (luma > 85) dark = " dark";

  const index = Math.floor(Math.random() * patterns.length);
  accentColor += "ff";

  const backgroundColors = ["#ecefe9", "#110d0d"];

  const printRef = React.useRef<HTMLDivElement | null>(null);

  const captureCard = async (): Promise<Blob> => {
    if (!printRef.current) throw new Error("Card not available!");

    printRef.current.classList.add("exporting");

    const canvas = await html2canvas(printRef.current, {
      scale: 2.5,
      backgroundColor: dark ? backgroundColors[1] : backgroundColors[0],
      useCORS: true,
      allowTaint: true,
    });

    printRef.current.classList.remove("exporting");

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed to create blob!");
        resolve(blob);
      }, "image/png");
    });
  };

  const handleDownload = async () => {
    const blob = await captureCard();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = `card-${new Date().getTime()}.jpg`;

    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      const blob = await captureCard();
      if (!blob) return;

      const file = new File([blob], "wrapped.png", {
        type: "image/png",
        lastModified: Date.now(),
      });

      const shareData: ShareData = {
        files: [file],
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert("Unsupported on this device/browser");
      }
    } catch (e) {
      alert("Failed to share (" + e + ")");
    }
  };

  return (
    <div>
      <div
        className={"wrapped-card" + dark}
        ref={printRef}
        style={{
          //@ts-ignore
          "--accent-color": accentColor,
          "--pattern-image": "url(/" + patterns[index] + ".svg)",
          "--pattern-size": patternSizes[index],
          "--card-background-color": backgroundColors[0],
          "--card-background-color-dark": backgroundColors[1],
        }}
      >
        <div className="header">
          <div className="decoration">
            <p>{new Date().getFullYear()}</p>
          </div>
          <div className="backgroundPattern" />

          <img src={image} className="image" />
        </div>

        <div className="content">
          <div className="leaderboards">
            {topArtists != null ? (
              <div className="list-section">
                <p>Top Artists</p>
                <ol>
                  {topArtists.map((artist: Artist, index: number) => (
                    <li key={index}>
                      <span>{index + 1}</span> {artist.name}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <></>
            )}

            {topSongs != null ? (
              <div className="list-section">
                <p>Top Songs</p>
                <ol>
                  {topSongs.map((song: Song, index: number) => (
                    <li key={index}>
                      <span>{index + 1}</span> {song.title}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <></>
            )}

            {topAlbums != null ? (
              <div className="list-section">
                <p>Top Albums</p>
                <ol>
                  {topAlbums.map((album: Album, index: number) => (
                    <li key={index}>
                      <span>{index + 1}</span> {album.name}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <></>
            )}
          </div>

          <hr className="divider" />

          <div className="stats">
            <div className="group">
              <p>Minutes Listened</p>
              <p>{minutesListened.toLocaleString()}</p>
            </div>

            <div className="group">
              <p>Top Genre</p>
              <p>{topGenre}</p>
            </div>
          </div>

          <div className="ad">
            <FaMusic />
            <p>NAVIDROME WRAPPED</p>
          </div>
        </div>
      </div>
      <div id="cardUtilities">
        <button onClick={handleDownload}>Download image</button>
        <button onClick={handleShare}>Share image</button>
      </div>
    </div>
  );
};
