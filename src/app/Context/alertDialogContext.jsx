"use client";
import { createContext, useState } from "react";
import AlertDialog from "../components/alertDialog";
export const alertDialogContext = createContext([]);
export const AlertDialogProvider = ({ children }) => {
  const [info, setInfo] = useState({
    Title: "",
    Name: "",
    alertName: "",
    colorBtn:"white !important",
    type:"",
    payload:{}

  });
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
 

  return (
    <alertDialogContext.Provider value={{ info,open,handleClose, handleOpen, setInfo}}>
      <AlertDialog />
      {children}
    </alertDialogContext.Provider>
  );
};
