import React from "react";
import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { useRouter } from "next/router";
import { device } from "../sizes";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection("chats").where("users", "array-contains", user?.email);
  const [chatsSnapshot] = useCollection(userChatRef);
  const router = useRouter();

  const createChat = () => {
    const input = prompt("Please enter an email address for the user you wish to chat with");

    if (!input) {
      return;
    }

    if (EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
      // We need to add the chat into DB chats collections
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) => {
    console.log(
      chatsSnapshot?.docs.find(
        (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
      )
    );
    return !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  };

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user.photoURL}
          onClick={() => {
            auth.signOut();
          }}
        />
        <div style={{ marginLeft: "20px", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "20px" }}>{user?.displayName}</span>
          <small style={{ marginTop: "5px", fontSize: "12px", fontWeight: "lighter" }}>
            {user?.email}
          </small>
        </div>
        <IconsContainer>
          {/* <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton> */}
        </IconsContainer>
      </Header>

      {/* <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search> */}

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <SidebarButton onClick={createChat}>
          <IconButton>
            <ChatIcon style={{ color: "#2983FF" }} />
          </IconButton>
          Start a new chat
        </SidebarButton>
      </div>
      {/* List of chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  background-color: #121416;
  color: white;
  flex: 0.45;
  height: 100%;
  min-width: 280px;
  max-width: 300px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -mx--ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  @media ${device.mobileS} {
    min-width: 100%;
    max-width: 100%;
  }

  @media ${device.tablet} {
    min-width: 280px;
    max-width: 300px;
  }
`;

const Header = styled.div`
  background-color: #121416;
  color: white;
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  align-items: center;
  padding: 15px;
  height: 80px;
  margin-bottom: 10px;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  &&& {
    background-color: white;
    color: black;
    width: 95%;
    border-top-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;
