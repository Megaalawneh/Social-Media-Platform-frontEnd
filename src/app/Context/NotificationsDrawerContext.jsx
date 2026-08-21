"use client";
import { createContext, useState } from "react";
import NotificationsDrawer from "../components/NotificationsDrawer";
export const NotificationsDrawerContext = createContext([]);
export const NotificationsDrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <NotificationsDrawerContext.Provider value={{ open, toggleDrawer }}>
      <NotificationsDrawer />
      {children}
    </NotificationsDrawerContext.Provider>
  );
};
