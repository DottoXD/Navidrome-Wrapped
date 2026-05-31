import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import useNProgress from "./hooks/useNProgress";
import "./app.css";
import Footer from "./components/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Navidrome Wrapped | Navidrome Recap" },
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

export function Layout({ children }: { children: React.ReactNode }) {
  useNProgress();

  return (
    <html lang="en" role="main">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="contribution-banner">
          Want to support this project? Contribute on
          <a
            href="https://github.com/dottoxd/navidrome-wrapped"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </div>
        <main role="main">{children}</main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                  });
              });
            }
          `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div id="error">
      <h1>{message}</h1>
      <p className="error-details">{details}</p>
      {stack && (
        <pre className="error-stack">
          <code>{stack}</code>
        </pre>
      )}
      <Link to="/">
        <button type="button">Home</button>
      </Link>
    </div>
  );
}
