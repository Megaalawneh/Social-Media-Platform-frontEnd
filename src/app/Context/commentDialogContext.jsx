"use client";
import { createContext, useState } from "react";
import CommentDialog from "../components/commentDialog";
export const CommentDialogContext = createContext([]);

export const CommentDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [postId,setPostId] =useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <CommentDialogContext.Provider
      value={{ handleClickOpen, open, handleClose ,postId,setPostId}}
    >
      <CommentDialog />
      {children}
    </CommentDialogContext.Provider>
  );
};
