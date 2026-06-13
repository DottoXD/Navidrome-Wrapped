import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Navidrome Wrapped | Privacy Policy",
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

export default function PrivacyPolicy() {
  return (
    <div className="home-container">
      <article className="privacy-policy-body">
        <h2>PRIVACY POLICY</h2>
        <p>
          <span className="privacy-policy-bold">Last Updated:</span> May 28,
          2026
        </p>
        <p>
          This Privacy Policy ("Policy") governs the data processing practices
          of the Navidrome Wrapped open-source application, accessible via{" "}
          <code>wrapped.dotto.pw</code> (collectively, the "Service" or
          "Application"). This Service is provided as an open-source tool,
          operated strictly as a client-side utility.
        </p>
        <p>
          By accessing or using the Service, you acknowledge and agree to the
          terms outlined in this Policy.
        </p>

        <section>
          <h3>ARTICLE I: DEFINITIONS</h3>
          <ul>
            <li>
              <span className="privacy-policy-bold">"User"</span> (or "you")
              refers to any individual who accesses, interacts with, or utilizes
              the Application.
            </li>
            <li>
              <span className="privacy-policy-bold">"Client-Side"</span> refers
              to operations that execute entirely within the User's local web
              browser infrastructure, without transmitting payload data to
              external servers controlled by the Service developer.
            </li>
            <li>
              <span className="privacy-policy-bold">"Navidrome Instance"</span>{" "}
              refers to the independent, self-hosted media server operated by
              the User or a third party, containing the User’s personal music
              library and listening metrics.
            </li>
          </ul>
        </section>

        <section>
          <h3>ARTICLE II: DATA MINIMIZATION & ZERO-RETENTION ARCHITECTURE</h3>
          <p>
            The Service is engineered under strict data minimization principles.
          </p>
          <ol>
            <li>
              <span className="privacy-policy-bold">
                Non-Collection of Personal Data:
              </span>{" "}
              The Service does not collect, harvest, transmit, or retain any
              Personal Data, including but not limited to names, email
              addresses, IP addresses, or listening histories.
            </li>
            <li>
              <span className="privacy-policy-bold">Credential Security:</span>{" "}
              To utilize the Service, Users must input their specific Navidrome
              Instance URL and associated account credentials. This
              authentication data is utilized solely to establish a direct
              cryptographic connection from the User's browser to the User's
              designated Navidrome Instance.
            </li>
            <li>
              <span className="privacy-policy-bold">
                No Persistent Local Storage:
              </span>{" "}
              The Service does not write authentication credentials, tokens, or
              configuration variables to persistent local browser storage (such
              as <code>localStorage</code> or <code>sessionStorage</code>). All
              session data exists exclusively in volatile runtime memory (RAM)
              and is permanently destroyed upon browser tab closure, refresh, or
              session termination.
            </li>
            <li>
              <span className="privacy-policy-bold">
                No Direct Server Infrastructure:
              </span>{" "}
              The developer does not maintain, rent, or operate backend
              application servers, databases, or storage repositories for this
              Service.
            </li>
          </ol>
        </section>

        <section>
          <h3>ARTICLE III: THIRD-PARTY INFRASTRUCTURE LOGGING</h3>
          <p>
            The hosted version of the Service is deployed via GitHub Pages, an
            infrastructure service operated by GitHub, Inc. ("GitHub").
          </p>
          <ol>
            <li>
              <span className="privacy-policy-bold">Independent Logging:</span>{" "}
              Users acknowledge that GitHub automatically captures standard
              internet server log information for operational security,
              stability, and compliance purposes.
            </li>
            <li>
              <span className="privacy-policy-bold">
                Scope of Infrastructure Logs:
              </span>{" "}
              These logs may contain network identifiers (IP addresses), browser
              user-agent details, system timestamps, and HTTP request headers.
            </li>
            <li>
              <span className="privacy-policy-bold">Data Isolation:</span> These
              infrastructure logs are collected independently by GitHub. The
              developer of the Service has no access to real-time logs, nor are
              these logs integrated into the Application’s functional
              architecture. For further details, please consult the GitHub
              Privacy Statement.
            </li>
          </ol>
        </section>

        <section>
          <h3>ARTICLE IV: EXCLUSION OF THIRD-PARTY TRACKING AND ASSETS</h3>
          <ol>
            <li>
              <span className="privacy-policy-bold">Analytics Exclusion:</span>{" "}
              The Service explicitly disclaims the use of tracking cookies, web
              beacons, tracking pixels, or third-party telemetry scripts (e.g.,
              Google Analytics, advertising tracking).
            </li>
            <li>
              <span className="privacy-policy-bold">Runtime Isolation:</span>{" "}
              All software assets, libraries, scripts, and fonts are compiled
              locally within the static build directory of the Application. The
              Service executes no external remote procedure calls (RPCs) or CDN
              fetches to unauthorized third-party servers during runtime.
            </li>
          </ol>
        </section>

        <section>
          <h3>ARTICLE V: SOURCE CODE TRANSPARENCY & AUDITABILITY</h3>
          <p>
            The Application is licensed and distributed as open-source software.
            The complete repository, deployment history, and source code are
            publicly accessible for independent security auditing and
            verification at:{" "}
            <a
              href="https://github.com/dottoxd/navidrome-wrapped"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/dottoxd/navidrome-wrapped
            </a>
          </p>
        </section>

        <section>
          <h3>ARTICLE VI: AMENDMENTS TO THIS POLICY</h3>
          <p>
            The developer reserves the right to modify this Policy at any time
            to reflect software updates or infrastructure changes. Modifications
            will become effective immediately upon posting the updated text to
            the repository or hosted URL. Continued use of the Service following
            an update constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h3>ARTICLE VII: CONTACT & DISPUTE RESOLUTION</h3>
          <p>
            For technical inquiries, source code clarifications, or issues
            arising from the operation of the Application, Users may submit a
            formal issue via the public GitHub repository tracking system.
          </p>
        </section>
      </article>
    </div>
  );
}
