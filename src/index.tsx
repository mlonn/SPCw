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

LogRocket.init("spc/spcw");

const state = window.localStorage.getItem("athlete");
if (state) {
  const athlete = JSON.parse(state);
  LogRocket.identify(athlete.id, {
    name: athlete.name,
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
