import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { useIdentityContext } from "react-netlify-identity";
import { Header, Heading, Box, Button } from "grommet";
import NetlifyIdentityWidget from "netlify-identity-widget";
import styled from "styled-components";
NetlifyIdentityWidget.init();
export const LogIn: React.FunctionComponent = () => {
  const { loginUser, param } = useIdentityContext();
  const [error, setError] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null!);
  const passwordInput = useRef<HTMLInputElement>(null!);
  const logInButton = useRef<HTMLButtonElement>(null!);
  const Container = styled(Box)`
    height: 100vh;
  `;
  const logIn = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    loginUser(email, password, true)
      .then(() => <Redirect to="/" />)
      .catch(err => {
        setError(true);
        console.log(err);
      });
  };

  return (
    <Container fill justify="center" align="center">
      <Heading level="1">QA version are not public plase sign in</Heading>
      <Button label="Sign in" onClick={() => NetlifyIdentityWidget.open()} />
    </Container>
  );
};
