import { Anchor, Box, Button, Header as GHeader, ResponsiveContext, Text } from "grommet";
import { Home } from "grommet-icons";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const size = useContext(ResponsiveContext);

  return (
    <GHeader direction="row" justify="evenly" align="center" alignSelf="center" pad="medium">
      <Link to="/">
        <Box justify="center" align="center" direction="row" gap="small">
          {size !== "small" && <Anchor href="" label="SuperPower Calculator" />}
          <Home />
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

        <Search open={searchOpen} setOpen={value => setSearchOpen(value)} />
      </Box>
    </GHeader>
  );
};

export default Header;
