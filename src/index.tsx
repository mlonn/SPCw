import React from "react";
import ReactDOM from "react-dom";
import { Grommet, grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { theme } from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={deepMerge(grommet, theme)}>
      <App />
    </Grommet>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
