"use client";
import React, { useEffect, useState } from "react";
import PageLayout from "../../../components/PageLayout";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import CustomTextFields from "../../../components/customTextField";
import Button from "@mui/material/Button";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ButtonBase from "@mui/material/ButtonBase";
import { useContext } from "react";
import { AuthGuardContext } from "../../../Context/AuthGuardContext";
import { AlertDialogProvider } from "../../../Context/alertDialogContext";
import { alertDialogContext } from "../../../Context/alertDialogContext";
import axios from "axios";
import { API_BASE_URL } from "../../../api/config";
import { geocodeCityApi } from "../../../api/users";

function getDateValue(value) {
  if (typeof value === "string") return value.slice(0, 10);
  return value instanceof Date ? value.toISOString().slice(0, 10) : "";
}

function isValidBirthDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    date <= new Date()
  );
}

function EditAccountForm() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(undefined);
  const { currentUser, setCurrentUser } = useContext(AuthGuardContext);
  const { userProfilePic } = currentUser || {};
  const [inputEdit, setInputEdit] = useState("");
  const { handleOpen, setInfo } = useContext(alertDialogContext);
  const [value, setValue] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    function me() {
      setIsHydrated(true);
      setInputEdit(
        currentUser
          ? {
              ...currentUser,
              userPassword: "",
              userCityName: currentUser.userCity?.name || "",
            }
          : "",
      );
    }
    me();
  }, [currentUser]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setSaveError("");
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
      if (!currentUser || !inputEdit?._id) {
        setValue(true);
        return;
      }

      const fullNameChanged =
        (inputEdit?.userFullName ?? "") !== (currentUser.userFullName ?? "");
      const userNameChanged =
        (inputEdit?.userName ?? "") !== (currentUser.userName ?? "");
      const bioChanged =
        (inputEdit?.userBio ?? "") !== (currentUser.userBio ?? "");
      const validFullName =
        !fullNameChanged ||
        (typeof inputEdit?.userFullName === "string" &&
          /^[A-Za-z]/.test(inputEdit.userFullName));
      const validUserName =
        !userNameChanged ||
        (inputEdit?.userName?.length >= 6 &&
          /^[A-Za-z][A-Za-z0-9]*$/.test(inputEdit.userName));
      const password = inputEdit?.userPassword || "";
      const validUserPassword =
        !password ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%]).{8,}$/.test(password);
      const birthDateValue = getDateValue(inputEdit?.userBirthDate);
      const birthDateChanged =
        birthDateValue !== getDateValue(currentUser.userBirthDate);
      const cityName = inputEdit?.userCityName?.trim() || "";
      const currentCityName = currentUser.userCity?.name?.trim() || "";
      const cityChanged = cityName !== currentCityName;
      const isValid =
        (!bioChanged || (inputEdit?.userBio || "").length <= 100) &&
        (!birthDateChanged || isValidBirthDate(birthDateValue)) &&
        (!cityChanged || Boolean(cityName)) &&
        validFullName &&
        validUserName &&
        validUserPassword;
      const changedFields = [
        "userFullName",
        "userEmail",
        "userName",
        "userBio",
        "userProfilePic",
      ];
      const hasChanges =
        Boolean(password) ||
        changedFields.some(
          (field) => (inputEdit[field] ?? "") !== (currentUser[field] ?? ""),
        ) ||
        birthDateChanged ||
        cityChanged;

      setValue(!isValid || !hasChanges);
    }
    validinputData();
  }, [inputEdit, currentUser]);

  const handleSave = () => {
    if (!inputEdit?._id) return;
    setInfo({
      Title: "Change the Proflie!",
      Name: "Are You Sure you Want To Change The Proflie? ",
      alertName: "Change",
      type: "editProfile",
      payload: async () => {
        const {
          userFullName,
          userEmail,
          userName,
          userPassword,
          userBio,
          userProfilePic,
          userBirthDate,
        } = inputEdit;
        setIsSaving(true);
        try {
          const updates = {
            userFullName,
            userEmail,
            userName,
            userPassword,
            userBio,
            userProfilePic,
          };
          if (
            getDateValue(userBirthDate) !==
            getDateValue(currentUser?.userBirthDate)
          ) {
            updates.userBirthDate = getDateValue(userBirthDate);
          }
          if (
            inputEdit.userCityName.trim() !==
            (currentUser?.userCity?.name?.trim() || "")
          ) {
            updates.userCity = await geocodeCityApi(inputEdit.userCityName);
          }

          const response = await axios.put(
            `${API_BASE_URL}/user`,
            updates,
            {
              withCredentials: true,
            },
          );

          setCurrentUser(response.data.user);
          setInputEdit({
            ...response.data.user,
            userPassword: "",
            userCityName: response.data.user.userCity?.name || "",
          });
          setAvatarSrc(undefined);
          setSaveError("");
        } catch (error) {
          setSaveError(
            error.response?.data?.error ||
              error.response?.data?.message ||
              "Please check your city and profile details, then try again.",
          );
        } finally {
          setIsSaving(false);
        }
      },
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
              required={false}
              value={inputEdit?.userPassword || ""}
              onChange={handleFieldChange("userPassword")}
              placeholder={
                "Leave blank to keep current password; new password needs 8 characters, upper/lowercase, a number, and @ $ %"
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
            <CustomTextFields
              id="user-birth-date"
              label="Date of birth"
              type="date"
              value={
                getDateValue(inputEdit?.userBirthDate)
              }
              onChange={handleFieldChange("userBirthDate")}
            />
            <CustomTextFields
              id="user-city"
              label="City"
              type="text"
              required
              value={inputEdit?.userCityName || ""}
              onChange={handleFieldChange("userCityName")}
              placeholder="Enter your city"
            />
            {saveError && (
              <Typography color="error" role="alert" sx={{ mt: 1 }}>
                {saveError}
              </Typography>
            )}
            <Button
              variant="contained"
              endIcon={<SaveAsIcon />}
              sx={{ marginTop: "20px" }}
              onClick={handleSave}
              disabled={value || isSaving}
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
    <AlertDialogProvider>
      <EditAccountForm />
    </AlertDialogProvider>
  );
}
