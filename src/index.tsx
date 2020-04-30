import * as Sentry from "@sentry/browser";
import { Grommet, grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import LogRocket from "logrocket";
import React from "react";
import ReactDOM from "react-dom";
import { IdentityContextProvider } from "react-netlify-identity";
import { Normalize } from "styled-normalize";
import App from "./App";
import AthleteProvider from "./context/AthleteProvider";
import * as serviceWorker from "./serviceWorker";
import { theme } from "./theme";

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
    <Grommet theme={deepMerge(grommet, theme)}>
      <IdentityContextProvider url={url}>
        <AthleteProvider>
          <Normalize />
          <App />
        </AthleteProvider>
      </IdentityContextProvider>
    </Grommet>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
