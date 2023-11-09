import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lastMessage, setLastMessage] = useState("");
  const [lastMessageType, setLastMessageType] = useState("");
  const [lastSentTime, setLastSentTime] = useState("");

  const setUserData = (userData) => {
    setUser(userData);
  };

  const updateLastMessage = (message, messageType, sentTime) => {
    setLastMessage(message);
    setLastMessageType(messageType);
    setLastSentTime(sentTime);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUserData,
        lastMessage,
        lastMessageType,
        lastSentTime,
        updateLastMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
