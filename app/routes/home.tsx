import { useLocation, useNavigate, useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import React from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Navidrome Wrapped" }];
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
      <p className="error">
        {Boolean(searchParams.get("error")) == true && error
          ? "An error occured while creating your Navidrome Wrapped:"
          : ""}{" "}
        {error}
      </p>
      <div>
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
      <button onClick={handleGenerate}>Generate</button>
    </div>
  );
}
