import styled from "styled-components";
import React from "react";
import Head from "next/head";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebaseConfig";
import { device } from "../sizes";

function Login() {
  const handleSignIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="/chatHeroSection.svg" height={200} />
        <h2>ChatSpace</h2>
        <Button variant="outlined" onClick={handleSignIn}>
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  box-shadow: 1px 1px 11px -8px rgba(0, 0, 0, 0.7);
  height: auto;
  padding: 15px 0px;

  @media ${device.mobileXS} {
    width: 95%;
  }

  @media ${device.mobileS} {
    width: 95%;
  }

  @media ${device.mobileL} {
    width: 55%;
  }

  @media ${device.tablet} {
    width: 35%;
  }

  @media ${device.laptop} {
    width: 30%;
  }
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
`;
