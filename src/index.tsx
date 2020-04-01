import { Grommet, grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import React from "react";
import ReactDOM from "react-dom";
import { Normalize } from "styled-normalize";
import App from "./App";
import AthleteProvider from "./context/AthleteProvider";
import * as serviceWorker from "./serviceWorker";
import { theme } from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={deepMerge(grommet, theme)}>
      <AthleteProvider>
        <Normalize />
        <App />
      </AthleteProvider>
    </Grommet>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
