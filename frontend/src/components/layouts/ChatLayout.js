import React, { useEffect, useRef, useState } from "react";
import { getAllUsers, getChatRooms, initiateSocketConnection } from "../../services/ChatService";
import { useAuth } from "../../contexts/AuthContext";
import ChatRoom from "../chat/ChatRoom";
import Welcome from "../chat/Welcome";
import AllUsers from "../chat/AllUsers";
import SearchUsers from "../chat/SearchUsers";
import UserDetails from "./UserDetails";
import UserDetailsBox from "./UserDetailsBox";

export default function ChatLayout() {
  const [users, SetUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [onlineUsersId, setOnlineUsersId] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isContact, setIsContact] = useState(false);
  const socket = useRef();
  const { currentUser } = useAuth();

  useEffect(() => {
    const getSocket = async () => {
      const res = await initiateSocketConnection();
      socket.current = res;
      socket.current.emit("addUser", currentUser.uid);
      socket.current.on("getUsers", (users) => {
        const userId = users.map((u) => u[0]);
        setOnlineUsersId(userId);
      });
    };

    getSocket();
  }, [currentUser.uid]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getChatRooms(currentUser.uid);
      setChatRooms(res);
    };

    fetchData();
  }, [currentUser.uid]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllUsers();
      const updatedUsers = res.some((user) => user.uid === currentUser.uid)
        ? res
        : [...res, currentUser];
      SetUsers(updatedUsers);
    };

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    setFilteredUsers(users);
    setFilteredRooms(chatRooms);
  }, [users, chatRooms]);

  useEffect(() => {
    if (isContact) {
      setFilteredUsers([]);
    } else {
      setFilteredRooms([]);
    }
  }, [isContact]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery);

    const searchedUsers = users.filter((user) =>
      user.displayName.toLowerCase().includes(newSearchQuery.toLowerCase())
    );

    const searchedUsersId = searchedUsers.map((u) => u.uid);

    if (chatRooms.length !== 0) {
      chatRooms.forEach((chatRoom) => {
        const isUserContact = chatRoom.members.some(
          (e) => e !== currentUser.uid && searchedUsersId.includes(e)
        );
        setIsContact(isUserContact);

        isUserContact
          ? setFilteredRooms([chatRoom])
          : setFilteredUsers(searchedUsers);
      });
    } else {
      setFilteredUsers(searchedUsers);
    }
  };

  const handleToggleStatus = (userId) => {
    console.log(`Toggle status for user with ID ${userId}`);
  };

  return (
    <div className="container ">
      <div className="lg:flex">
        {/* Left Panel */}
        <div className="w-full lg:w-1/4 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 overflow-y-auto rounded">
          <SearchUsers handleSearch={handleSearch} />

          {searchQuery !== "" ? (
            filteredUsers.map((user) => (
              <UserDetails
                key={user.uid}
                user={user}
                onlineUsersId={onlineUsersId}
                handleToggleStatus={handleToggleStatus}
              />
            ))
          ) : (
            users.map((user) =>
              user.uid === currentUser.uid ? (
                <UserDetails
                  key={user.uid}
                  user={user}
                  onlineUsersId={onlineUsersId}
                  handleToggleStatus={handleToggleStatus}
                />
              ) : null
            )
          )}

          <AllUsers
            users={searchQuery !== "" ? filteredUsers : users}
            chatRooms={searchQuery !== "" ? filteredRooms : chatRooms}
            setChatRooms={setChatRooms}
            onlineUsersId={onlineUsersId}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
        </div>

        {/* Center Panel */}
        <div className="flex-1">
          {currentChat ? (
            <ChatRoom
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          ) : (
            <Welcome />
          )}
        </div>

        {/* Right Panel */}
        <div className="lg:w-1/4 border border-gray-500 p-4">
          {/* UserDetailsBox component */}
          <UserDetailsBox user={currentUser} />
        </div>
      </div>
    </div>
  );
}