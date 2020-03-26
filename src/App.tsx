import { Box, Header, Heading, Main } from "grommet";
import React from "react";
import CalculateFTP from "./components/CalculateFTP";

function App() {
  return (
    <Main>
      <Box pad="medium">
        <Header alignSelf="center">
          <Heading>FTP/CP calculator</Heading>
        </Header>
        <CalculateFTP />
      </Box>
    </Main>
  );
}

export default App;
