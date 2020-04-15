import { Anchor, Box, Button, Footer, Grid, Header, Main, ResponsiveContext, Text } from "grommet";
import { Home as HomeIcon } from "grommet-icons";
import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import Search from "./components/form/Search";
import CalculateFTP from "./pages/CalculateFTP";
import Calculators from "./pages/Calculators";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { IdentityContextProvider, useIdentityContext } from "react-netlify-identity";
import { LogIn } from "./pages/Login";

const AppContainer = styled.div`
  min-height: 100vh;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
`;
function App() {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const size = useContext(ResponsiveContext);
  const { isLoggedIn } = useIdentityContext();
  if (!isLoggedIn && window.location.hostname.includes("qa")) {
    return <LogIn />;
  }
  return (
    <Main>
      <Router>
        <Switch>
          <AppContainer>
            <Box pad="medium" height="100%">
              <Header direction="row" justify="between" align="center" width="xlarge" alignSelf="center" gap="medium">
                <Link to="/">
                  <Box justify="center" align="center" direction="row" gap="small">
                    {size !== "small" && <Anchor href="" label="SuperPower Calculator" />}
                    <HomeIcon />
                  </Box>
                </Link>
                <Box direction="row" gap="small">
                  {!searchOpen && (
                    <Button plain>
                      {({ hover }: { hover: boolean }) => (
                        <Link to="/profile">
                          <Box
                            pad={{ vertical: "small", horizontal: "medium" }}
                            round="xlarge"
                            background={hover ? "active" : "control"}
                          >
                            <Text>Profile</Text>
                          </Box>
                        </Link>
                      )}
                    </Button>
                  )}
                  {!searchOpen && (
                    <Button plain>
                      {({ hover }: { hover: boolean }) => (
                        <Link to="/calculators">
                          <Box
                            pad={{ vertical: "small", horizontal: "medium" }}
                            round="xlarge"
                            background={hover ? "active" : "control"}
                          >
                            <Text>Calculators</Text>
                          </Box>
                        </Link>
                      )}
                    </Button>
                  )}

                  <Search open={searchOpen} setOpen={(value) => setSearchOpen(value)} />
                </Box>
              </Header>
              <Route exact path="/" component={Home} />
              <Route path="/ftp" component={CalculateFTP} />
              <Route path="/profile" component={Profile} />
              <Route path="/calculators" component={Calculators} />
            </Box>
            <Box background="dark-2">
              <Footer background="dark-2">
                <Box pad="medium" align="center" fill>
                  <div>
                    {`Made with love by `}
                    <Anchor
                      target="_blank"
                      label="Steve Palladino"
                      href="https://www.facebook.com/groups/PalladinoPowerProject/"
                    />
                    {`, `}
                    <Anchor
                      target="_blank"
                      label="Steve Bateman"
                      href="https://www.facebook.com/groups/from1runner2another/"
                    />
                    {`, `}
                    <Anchor target="_blank" label="Alex Tran" href="https://www.powerpacing.run/" />
                    {` and `}
                    <Anchor target="_blank" label="Mikael Lönn" href="https://mikaellonn.se" />
                  </div>
                </Box>
              </Footer>
            </Box>
          </AppContainer>
        </Switch>
      </Router>
    </Main>
  );
}

export default App;
