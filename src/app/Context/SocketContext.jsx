"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthGuardContext } from "./AuthGuardContext";
import { API_BASE_URL } from "../api/config";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { currentUser } = useContext(AuthGuardContext);
  const [socket, setSocket] = useState(null);
  const [socketUserId, setSocketUserId] = useState(null);

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }

    const newSocket = io(API_BASE_URL, {
      withCredentials: true,
    });
    newSocket.on("connect", () => {
      setSocket(newSocket);
      setSocketUserId(currentUser._id);
    });
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?._id]);

  return (
    <SocketContext.Provider
      value={{
        socket:
          currentUser?._id && currentUser._id === socketUserId ? socket : null,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
