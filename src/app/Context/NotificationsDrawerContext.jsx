"use client";
import { createContext, useCallback, useState } from "react";
import NotificationsDrawer from "../components/NotificationsDrawer";
import { SocketProvider } from "./SocketContext";
import { CommentDialogProvider } from "./commentDialogContext";
export const NotificationsDrawerContext = createContext([]);

export const NotificationsDrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const markNewNotification = useCallback(() => {
    setHasUnreadNotifications(true);
  }, []);

  const toggleDrawer = useCallback((newOpen, anchorElement = null) => {
    setOpen(newOpen);
    setAnchorEl(newOpen ? anchorElement : null);
    if (newOpen) {
      setHasUnreadNotifications(false);
    }
  }, []);
  return (
    <NotificationsDrawerContext.Provider
      value={{
        open,
        anchorEl,
        toggleDrawer,
        hasUnreadNotifications,
        markNewNotification,
      }}
    >
      <CommentDialogProvider>
        <SocketProvider>
          <NotificationsDrawer />
          {children}
        </SocketProvider>
      </CommentDialogProvider>
    </NotificationsDrawerContext.Provider>
  );
};
