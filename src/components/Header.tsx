import { Box, Header as GHeader, ResponsiveContext, Text } from "grommet";
import { Home } from "grommet-icons";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Search from "./Search";
const StyledLink = styled(Link)`
  text-decoration: none;
`;
const Header = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const size = useContext(ResponsiveContext);

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
            <StyledLink to="/profile">
              <Box
                background={"control"}
                pad={{ vertical: "small", horizontal: "medium" }}
                round="xlarge"
                hoverIndicator={"active"}
                onClick={() => {}}
              >
                <Text>Profile</Text>
              </Box>
            </StyledLink>
          )}
          {!searchOpen && (
            <StyledLink to="/calculators">
              <Box
                hoverIndicator={"active"}
                onClick={() => {}}
                background={"control"}
                pad={{ vertical: "small", horizontal: "medium" }}
                round="xlarge"
              >
                <Text>Calculators</Text>
              </Box>
            </StyledLink>
          )}

          <Search open={searchOpen} setOpen={(value) => setSearchOpen(value)} />
        </Box>
      </GHeader>
    </Box>
  );
};

export default Header;
