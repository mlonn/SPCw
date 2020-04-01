import { Box, Header, Heading, Main } from "grommet";
import React from "react";
import CalculateFTP from "./pages/CalculateFTP";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import styled from "styled-components";

function App() {
  return (
    <Main>
      <Box pad="medium">
        <Router>
          <Switch>
            <Route path="/ftp">
              <CalculateFTP />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </Box>
    </Main>
  );
}

export default App;
