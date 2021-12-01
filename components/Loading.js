import styled from "styled-components";
import Spinner from "react-spinner-material";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png"
          alt=""
          height={200}
        />
        <Spinner radius={40} color={"#3CBC28"} stroke={3} visible={true} />
      </div>
    </center>
  );
}

export default Loading;
