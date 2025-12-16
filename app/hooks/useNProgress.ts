import nProgress from "nprogress";
import React from "react";
import { useRef } from "react";
import { useLocation } from "react-router";

export default function useNProgress() {
  const location = useLocation();
  const firstRun = useRef(true);

  React.useEffect(() => {
    nProgress.configure({});
  }, []);

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    nProgress.start();

    requestAnimationFrame(() => {
      nProgress.done();
    });
  }, [location.key]);
}
