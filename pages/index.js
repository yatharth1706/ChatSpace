import Head from "next/head";
import Sidebar from "./../components/Sidebar";
import styled from "styled-components";
import { device } from "./../sizes";

export default function Home() {
  return (
    <div style={{ display: "flex" }}>
      <Head>
        <title>Chat Space</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      <main style={{ width: "100%", height: "100vh" }}>
        <HeroSectionContainer>
          <HeroSectionImage src="/chatHeroSection.svg" height={200} />
          <HeroSectionText>
            <h2>Welcome to Chat Space</h2>
            <div style={{ lineHeight: "20px" }}>
              <p>
                From left sidebar you can choose the existing chats to connect with or create a new
                chat from left sidebar
              </p>
            </div>
          </HeroSectionText>
        </HeroSectionContainer>
      </main>
    </div>
  );
}

const HeroSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  justify-content: center;
  width: 100%;
  margin-top: 60px;

  @media ${device.mobileL} {
    display: none;
  }

  @media ${device.tablet} {
    display: flex;
  }
`;

const HeroSectionImage = styled.img``;

const HeroSectionText = styled.div`
  text-align: center;
  font-size: 14px;
`;
