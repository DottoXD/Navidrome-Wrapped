import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import React from "react";

export function meta({ }: Route.MetaArgs) {
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
    { property: "og:url", content: "https://wrapped.dotto.pw" }
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [serverUrl, setServerUrl] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const location = useLocation();
  const { error } = location.state || {};

  const handleGenerate = () => {
    navigate("/wrapped", {
      state: {
        serverUrl,
        username,
        password,
      },
    });
  };

  return (
    <div id="home">
      <h1>Navidrome Wrapped</h1>
      {Boolean(searchParams.get("error")) == true && error && (
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
