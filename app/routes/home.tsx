import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import React from "react";
import type { WrappedDiff } from "@/types/WrappedDiff";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Navidrome Wrapped | Home",
    },
    {
      name: "description",
      content:
        "A simple project to generate fancy cards displaying user activity on Navidrome.",
    },
    { property: "og:title", content: "Navidrome Wrapped | Navidrome Recap" },
    {
      property: "og:description",
      content:
        "A simple project to generate fancy cards displaying user activity on Navidrome.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://wrapped.dotto.pw" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [serverUrl, setServerUrl] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [prevDiff, setPrevDiff] = React.useState<WrappedDiff | null>(null);
  const [diffFileName, setDiffFileName] = React.useState<string>("");
  const [diffError, setDiffError] = React.useState<string>("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const location = useLocation();
  const { error } = location.state || {};

  const handleDiffFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiffError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: WrappedDiff = JSON.parse(reader.result as string);

        if (
          typeof parsed.diffTime !== "number" ||
          !Array.isArray(parsed.songs) ||
          !Array.isArray(parsed.genres) ||
          !Array.isArray(parsed.artists)
        ) {
          throw new Error("Invalid diff file format.");
        }

        setPrevDiff(parsed);
        setDiffFileName(file.name);
      } catch {
        setDiffError(
          "Could not read diff file — make sure it's a valid .wrapped file.",
        );
        setPrevDiff(null);
        setDiffFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleClearDiff = () => {
    setPrevDiff(null);
    setDiffFileName("");
    setDiffError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = () => {
    navigate("/wrapped", {
      state: {
        serverUrl,
        username,
        password,
        prevDiff: prevDiff ?? null,
      },
    });
  };

  const diffDate = prevDiff
    ? new Date(prevDiff.diffTime).toLocaleDateString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    : null;

  return (
    <div id="home">
      <h1>Navidrome Wrapped</h1>

      {Boolean(searchParams.get("error")) && error && (
        <p className="error">{error}</p>
      )}

      <div className="wrapped-form">
        <input
          type="url"
          id="serverUrl"
          placeholder="Server URL"
          onChange={(e) => setServerUrl(e.target.value)}
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="diff-import">
          <label htmlFor="diffFile" className="diff-label">
            Previous diff (optional)
          </label>
          <p className="diff-hint">
            Import a .wrapped file from a previous year to see only this year's
            listening stats.
          </p>

          {prevDiff ? (
            <div className="diff-loaded">
              <span className="diff-loaded-name">
                {diffFileName}
                {diffDate && (
                  <span className="diff-loaded-date"> — saved {diffDate}</span>
                )}
              </span>
              <button
                type="button"
                className="diff-clear"
                onClick={handleClearDiff}
              >
                Remove
              </button>
            </div>
          ) : (
            <input
              ref={fileInputRef}
              type="file"
              id="diffFile"
              accept=".wrapped,application/json"
              onChange={handleDiffFile}
            />
          )}

          {diffError && <p className="error diff-error">{diffError}</p>}
        </div>
      </div>

      <p className="privacy-notice">
        By generating your Wrapped, you agree to the{" "}
        <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </Link>
        .
      </p>
      <button onClick={handleGenerate}>Generate</button>
    </div>
  );
}
