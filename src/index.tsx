import * as Sentry from "@sentry/browser";
import { generate, Grommet, grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import LogRocket from "logrocket";
import React from "react";
import ReactDOM from "react-dom";
import { IdentityContextProvider } from "react-netlify-identity";
import { Normalize } from "styled-normalize";
import App from "./App";
import AthleteProvider from "./context/AthleteProvider";
import { ServiceWorkerProvider } from "./hooks/useServiceWorker";
import { theme } from "./theme";
window.addEventListener("error", async (err) => {
  // Since we are handling the error here, we must make
  // sure we log it into the console nonetheless, otherwise
  // it will be very difficult to understand why your app
  // is crashing.
  console.error(err);

  // If no service worker is available, our work ends here
  // because we don't need to unregister the service worker
  // to make sure the user is able to get a newer version of
  // our application.
  if (!navigator.serviceWorker) {
    return;
  }

  // On development builds of React, error boundaries don't stop
  // errors from bubbling up to the window error handler, so we don't
  // want to execute this code here because it would be unreliable
  // https://github.com/facebook/react/issues/12897#issuecomment-410036991
  if (process.env.NODE_ENV !== "development") {
    // We want to run this code only if we detect a new service worker
    // is getting installed or is installed but waiting to be activated.
    // This will make sure we don't run this code on a sane environment
    // that is crashing for an error not related to stale app cache.
    const registration = await navigator.serviceWorker.ready;
    if (registration.installing || registration.waiting) {
      navigator.serviceWorker.ready.then(async (reg) => {
        await reg.unregister();
        // Once the service worker is unregistered, we can reload
        // the page to let the browser download a fresh copy of our app
        window.location.reload();
      });
    }
  }
});
Sentry.init({
  dsn: "https://3a9e9da734b046f0b17b868e6cf6e2be@o385775.ingest.sentry.io/5219025",
  release: "spcw@" + process.env.npm_package_version,
});

LogRocket.init("spc/spcw");

LogRocket.getSessionURL((sessionURL) => {
  Sentry.configureScope((scope) => {
    scope.setExtra("sessionURL", sessionURL);
  });
});

const state = window.localStorage.getItem("athlete");
if (state) {
  const athlete = JSON.parse(state);
  LogRocket.identify(athlete.id, {
    name: athlete.name,
  });
  Sentry.configureScope((scope) => {
    scope.setExtra("id", athlete.id);
    scope.setExtra("name", athlete.name);
  });
}
const url = "https://superpowercalculator.com";

ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={deepMerge(generate(22), grommet, theme)}>
      <IdentityContextProvider url={url}>
        <ServiceWorkerProvider>
          <AthleteProvider>
            <Normalize />
            <App />
          </AthleteProvider>
        </ServiceWorkerProvider>
      </IdentityContextProvider>
    </Grommet>
  </React.StrictMode>,
  document.getElementById("root")
);
