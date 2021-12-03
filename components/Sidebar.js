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

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection("chats").where("users", "array-contains", user?.email);
  const [chatsSnapshot] = useCollection(userChatRef);

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
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <span style={{ marginLeft: "20px" }}>Yatharth Verma</span>
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

      <SidebarButton onClick={createChat}>
        <IconButton>
          <ChatIcon style={{ color: "white" }} />
        </IconButton>
        Start a new chat
      </SidebarButton>
      <hr style={{ height: "0.8px", border: "0.21px solid black" }} />
      {/* List of chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  background-color: #2f3136;
  color: white;
  flex: 0.45;
  height: 100vh;
  min-width: 250px;
  max-width: 300px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -mx--ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
`;

const Header = styled.div`
  background-color: #2f3136;
  color: white;
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid black;
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
  width: 100%;
  margin-top: 10px;
  &&& {
    color: white;
  }
`;
