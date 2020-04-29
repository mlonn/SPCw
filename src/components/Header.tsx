import { Box, Header as GHeader, ResponsiveContext, Text } from "grommet";
import { Home } from "grommet-icons";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import Search from "./Search";
const StyledLink = styled(Link)`
  text-decoration: none;
`;
const Header = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  return (
    <Box>
      <GHeader
        direction="row"
        justify="between"
        pad={{ vertical: "medium" }}
        alignSelf="center"
        width={{ max: "xlarge" }}
        align="center"
        fill
      >
        <Link to="/">
          <Box justify="center" align="center" direction="row" gap="small" pad={{ vertical: "medium" }}>
            {size !== "small" && <Text>SPC for Web</Text>}
            <Home />
          </Box>
        </Link>
        <Box direction="row" gap="small">
          {!searchOpen && (
            <Box
              background={"control"}
              pad={{ vertical: "small", horizontal: "medium" }}
              round="xlarge"
              hoverIndicator={"active"}
              onClick={() => history.push("/profile")}
            >
              <Text>Profile</Text>
            </Box>
          )}
          {!searchOpen && (
            <Box
              hoverIndicator={"active"}
              onClick={() => history.push("/calculators")}
              background={"control"}
              pad={{ vertical: "small", horizontal: "medium" }}
              round="xlarge"
            >
              <Text>Calculators</Text>
            </Box>
          )}

          <Search open={searchOpen} setOpen={(value) => setSearchOpen(value)} />
        </Box>
      </GHeader>
    </Box>
  );
};

export default Header;
