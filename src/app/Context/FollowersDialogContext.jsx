"use client";
import { createContext, useState } from "react";
import FollowersDialog from "../components/FollowersDialog";
export const FollowersDialogContext = createContext([]);
export const FollowersDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [value,SetValue] =useState("")
  const handleClickOpen = (event) => {
    setOpen(true);
    SetValue(event)
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <FollowersDialogContext.Provider
      value={{ open, handleClickOpen, handleClose,value }}
    >
      <FollowersDialog />
      {children}
    </FollowersDialogContext.Provider>
  );
};
