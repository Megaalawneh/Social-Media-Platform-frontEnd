"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { alertDialogContext } from "../Context/alertDialogContext";
import { useContext } from "react";
import { CreateProfile } from "../Context/CreateProfileContext";
import { styled } from "@mui/material/styles";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
  "& .MuiPaper-root": {
    backgroundColor: "rgb(35, 34, 34)",
    color: "white",
    width: "400px !important",
    borderRadius: "10px",
  },

  "& .mui-ujudvl-MuiTypography-root-MuiDialogContentText-root": {
    color: "white",
  },
  "& .MuiButtonBase-root": {
    color: "white",
    fontWeight: "600",
  },
}));

export default function AlertDialog() {
  const { info, open, handleClose } =
    useContext(alertDialogContext);
  const { dispatch } = useContext(CreateProfile);
  const handleDelete = () => {
    dispatch({ type: info.type, payload: info.payload });
  };
  return (
    <>
      <BootstrapDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
        disableScrollLock
      >
        <DialogTitle id="alert-dialog-title">{info.Title || ""}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {info.Name || ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <Button
            sx={{ color: info.colorBtn }}
            onClick={() => {
              handleClose();
              handleDelete();
             if( info.functionHandle){
               info.functionHandle();
             }
            }}
          >
            {info.alertName || ""}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
