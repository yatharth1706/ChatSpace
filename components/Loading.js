import styled from "styled-components";
import Spinner from "react-spinner-material";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img src="/chatHeroSection.svg" alt="" height={200} />
        <Spinner radius={40} color={"black"} stroke={3} visible={true} />
      </div>
    </center>
  );
}

export default Loading;
