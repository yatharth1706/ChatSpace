import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebaseConfig";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import BackIcon from "@material-ui/icons/ArrowBack";
import { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import TimeAgo from "timeago-react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Link from "next/link";
import { device } from "../sizes";

function ChatScreen({ chat, messages }) {
  const endOfMessagesRef = useRef(null);
  const emojiRef = useRef(null);

  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [messagesSnapshot] = useCollection(
    db.collection("chats").doc(router.query.id).collection("messages").orderBy("timestamp", "asc")
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
  );

  useEffect(() => {
    setInput("");
  }, [router.asPath]);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      console.log(messages);
      return JSON.parse(messages).map((message) => (
        <Message
          key={message.id}
          user={message.user}
          message={{
            ...message,
            timestamp: message.timestamp,
          }}
        />
      ));
    }
    if (messagesSnapshot) {
      if (messagesSnapshot?.docs.length >= 2) {
        scrollToBottom();
      }
    } else {
      if (messages && messages.length >= 2) {
        scrollToBottom();
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // Update the last seen when message is sent
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    if (messagesSnapshot) {
      if (messagesSnapshot?.docs.length >= 2) {
        scrollToBottom();
      }
    } else {
      if (messages && messages.length >= 2) {
        scrollToBottom();
      }
    }
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSelectEmoji = (items) => {
    console.log(items);
    let existingText = input;
    existingText += items?.native;
    setInput(existingText);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const handleClickOutside = (e) => {
    console.log(emojiRef);
    if (emojiRef && emojiRef.current && !emojiRef.current.contains(e.target)) {
      setShowEmojiPicker(false);
    }
  };

  return (
    <Container>
      <Header>
        {recipient ? <Avatar src={recipient?.photoURL} /> : <Avatar>{recipientEmail[0]}</Avatar>}
        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last Active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <BackIconButton>
            <IconButton>
              <Link href="/">
                <BackIcon style={{ color: "white" }} />
              </Link>
            </IconButton>
          </BackIconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {/* Show messages */}
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <div style={{ marginRight: "10px" }}>
          <InsertEmoticonIcon
            id="emojis-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {showEmojiPicker && (
          <div ref={emojiRef}>
            <Picker
              title="Pick your emoji…"
              emoji="point_up"
              set="apple"
              theme="dark"
              onClick={handleSelectEmoji}
              style={{ position: "absolute", bottom: "60px", left: "10px" }}
            />
          </div>
        )}
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowEmojiPicker(false);
          }}
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const BackIconButton = styled.div`
  @media ${device.mobileXL} {
    display: block;
  }

  @media ${device.tablet} {
    display: none;
  }
`;

const Container = styled.div`
  height: 100vh;
`;

const Header = styled.div`
  position: sticky;
  background-color: #161819;
  color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 12%;
  align-items: center;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0);
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;
  line-height: 12px;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #161819;
  min-height: 88%; ;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #161819;
  color: white;
  z-index: 100;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  border: none;
  border-radius: 10px;
  background-color: #27292d;
  color: white;
  outline: none;
`;
