"use client";
import React, { useEffect, useState } from "react";
import PageLayout from "../../../components/PageLayout";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import CustomTextFields from "../../../components/customTextField";
import Button from "@mui/material/Button";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ButtonBase from "@mui/material/ButtonBase";
import { useContext } from "react";
import {
  CreateProfile,
  CreateProfileProvider,
} from "../../../Context/CreateProfileContext";
import { AlertDialogProvider } from "../../../Context/alertDialogContext";
import { alertDialogContext } from "../../../Context/alertDialogContext";

function EditAccountForm() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(undefined);
  const { state } = useContext(CreateProfile);
  const { userProfilePic } = state.users?.[0] || {};
  const [inputEdit, setInputEdit] = useState("");
  const { handleOpen, setInfo } = useContext(alertDialogContext);

  useEffect(() => {
    
    function me() {
      setIsHydrated(true);
      setInputEdit(state.users[0]);
    }
    me();
  }, [state]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setInputEdit((prev) => {
      const updatedValue = {
        ...prev,
        [field]: value,
      };
      return updatedValue;
    });
  };

  const handleSave = () => {
    if (!inputEdit?.userId) return;
    setInfo({
      Title: "Change the Proflie!",
      Name: "Are You Sure you Want To Change The Proflie? ",
      alertName: "Change",
      type: "editProfile",
      payload: { inputEdit },
      colorBtn: "blue !important",
    });
    handleOpen();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newAvatarSrc = reader.result;
        setAvatarSrc(newAvatarSrc);
        setInputEdit((prev) => {
          const updatedValue = {
            ...prev,
            userProfilePic: newAvatarSrc,
          };
          return updatedValue;
        });
      };
      reader.readAsDataURL(file);
    }
  };
  if (!isHydrated) {
    return null;
  }

  return (
    <PageLayout>
      <div className="editContainer" >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", marginTop: "5px" }}
          >
            <ButtonBase
              component="label"
              role={undefined}
              tabIndex={-1}
              aria-label="Avatar image"
              sx={{
                borderRadius: "40px",
                "&:has(:focus-visible)": {
                  outline: "2px solid",
                  outlineOffset: "2px",
                },
              }}
            >
              <Avatar
                alt="Upload new avatar"
                src={avatarSrc || userProfilePic}
                sx={{ width: 200, height: 200 }}
              />
              <input
                type="file"
                accept="image/*"
                style={{
                  border: 0,
                  clip: "rect(0 0 0 0)",
                  height: "1px",
                  margin: "-1px",
                  overflow: "hidden",
                  padding: 0,
                  position: "absolute",
                  whiteSpace: "nowrap",
                  width: "1px",
                }}
                onChange={handleAvatarChange}
              />
            </ButtonBase>

            <div
              style={{
                display: "block",
                gap: "0px",
                color: "rgb(165, 154, 154)",
              }}
            >
              <Typography variant="h5">{inputEdit?.userName || ""}</Typography>
              <Typography variant="h6">
                {inputEdit?.userFullName || ""}
              </Typography>
            </div>
          </Stack>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <CustomTextFields
              id={"outlined-required"}
              label={"email address or username"}
              variant={"outlined"}
              type={"email"}
              required={true}
              value={inputEdit?.userEmail || ""}
              onChange={handleFieldChange("userEmail")}
            />
            <CustomTextFields
              id={"outlined-password-input"}
              label={"Password"}
              type={"password"}
              required={true}
              value={inputEdit?.userPassword || ""}
              onChange={handleFieldChange("userPassword")}
            />
            <CustomTextFields
              id={"outlined-basic"}
              label={"Full Name"}
              type={"text"}
              required={true}
              value={inputEdit?.userFullName || ""}
              onChange={handleFieldChange("userFullName")}
            />
            <CustomTextFields
              id={"outlined-basic"}
              label={"Username"}
              type={"text"}
              required={true}
              value={inputEdit?.userName || ""}
              onChange={handleFieldChange("userName")}
            />
            <Button
            
              variant="contained"
              endIcon={<SaveAsIcon />}
              sx={{ marginTop: "20px" }}
              onClick={handleSave}
              
            >
              save changes
            </Button>
          </div>
        </Box>
      </div>
    </PageLayout>
  );
}

export default function Page() {
  return (
    <CreateProfileProvider>
      <AlertDialogProvider >
        <EditAccountForm />
      </AlertDialogProvider>
    </CreateProfileProvider>
  );
}
