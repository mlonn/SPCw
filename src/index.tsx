import { generate, Grommet, grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import React from "react";
import ReactDOM from "react-dom";
import { IdentityContextProvider } from "react-netlify-identity";
import { Normalize } from "styled-normalize";
import App from "./App";
import AthleteProvider from "./context/AthleteProvider";
import * as serviceWorker from "./serviceWorker";
import { theme } from "./theme";

const url = "https://superpowercalculator.com";
ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={deepMerge(generate(22), grommet, theme)}>
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
