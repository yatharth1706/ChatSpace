import styled from "styled-components";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>{message?.timestamp ? moment(message.timestamp).format("LT") : "..."}</Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px 20px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #2883ff;
  color: white;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
`;

const Reciever = styled(MessageElement)`
  background-color: #202224;
  color: #acaeb2;
  text-align: left;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
`;

const Timestamp = styled.span`
  color: #dedede;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
