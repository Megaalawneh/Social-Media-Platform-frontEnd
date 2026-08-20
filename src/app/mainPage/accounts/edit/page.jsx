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
  const { state ,User} = useContext(CreateProfile);
  const { userProfilePic } = User;
  const [inputEdit, setInputEdit] = useState("");
  const { handleOpen, setInfo } = useContext(alertDialogContext);
  const [value, setValue] = useState(true);

  useEffect(() => {
    function me() {
      setIsHydrated(true);
      setInputEdit(User);
    }
    me();
  }, [state,User]);

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
  useEffect(() => {
    function validinputData() {
      const validFullName = /^[A-Za-z]/.test(inputEdit?.userFullName);
      const validUserName = /^[A-Za-z][A-Za-z0-9]*$/.test(inputEdit?.userName);
      const validUserPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%]).{8,}$/.test(
          inputEdit.userPassword,
        );
      if (
        inputEdit?.userName?.length >= 6 &&
        inputEdit?.userBio?.length <= 100 &&
        inputEdit?.userFullName !== "" &&
        validFullName &&
        validUserName &&
        validUserPassword
      ) {
        setValue(false);
      } else {
        setValue(true);
      }
    }
    validinputData();
  }, [inputEdit]);

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
      <div className="editContainer">
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
              placeholder={
                "password must be 8 characters and 1 uppercase letter and 1 lowercase letter and @ $ %"
              }
            />
            <CustomTextFields
              id={"outlined-basic"}
              label={"Full Name"}
              type={"text"}
              required={true}
              value={inputEdit?.userFullName || ""}
              onChange={handleFieldChange("userFullName")}
              placeholder={"required"}
            />
            <CustomTextFields
              id={"outlined-basic"}
              label={"Username"}
              placeholder={"Username must be 8 character"}
              type={"text"}
              required={true}
              value={inputEdit?.userName || ""}
              onChange={handleFieldChange("userName")}
            />
            <CustomTextFields
              id={"outlined-basic"}
              label={"Bio"}
              type={"text"}
               placeholder={"100 character maximum"}
              required={true}
              value={inputEdit?.userBio || ""}
              onChange={handleFieldChange("userBio")}
            />
            <Button
              variant="contained"
              endIcon={<SaveAsIcon />}
              sx={{ marginTop: "20px" }}
              onClick={handleSave}
              disabled={value}
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
      <AlertDialogProvider>
        <EditAccountForm />
      </AlertDialogProvider>
    </CreateProfileProvider>
  );
}
