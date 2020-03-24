import React from "react";
import { Main, Header, Heading, FormField, Form, TextInput, Box, Select } from "grommet";
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
