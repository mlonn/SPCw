import { Box, Button, Heading } from "grommet";
import NetlifyIdentityWidget from "netlify-identity-widget";
import React from "react";
import styled from "styled-components";
NetlifyIdentityWidget.init();
export const LogIn: React.FunctionComponent = () => {
  const Container = styled(Box)`
    height: 100vh;
  `;
  return (
    <Container fill justify="center" align="center">
      <Heading level="1">QA version are not public please sign in</Heading>
      <Button label="Sign in" onClick={() => NetlifyIdentityWidget.open("login")} />
    </Container>
  );
};
