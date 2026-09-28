"use client";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Container from "@mui/material/Container";
import "../styles/createAccountStyle.css";
import Mybutton from "./myButton";
import Typography from "@mui/material/Typography";
import CustomTextFields from "./customTextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../hooks/AuthGuard";
import { CreateProfileHandleApi, geocodeCityApi } from "../api/users";
import { useRouter } from "next/navigation";
import { AuthGuardContext } from "../Context/AuthGuardContext";
import { loginApi } from "../api/auth";
const selectMenuProps = {
  disableScrollLock: true,
  slotProps: {
    paper: {
      sx: {
        maxHeight: 220,
        overflowY: "auto",
        marginTop: 1,
        borderRadius: 2,
      },
    },
  },
};
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CreateAccount() {
  AuthGuard();
  const [month, setMonth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [days, setDays] = useState(31);
  const [inputData, setInputData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userBirthDay: "",
    userBirthMonth: "",
    userBirthYear: "",
    userCityName: "",
    userFullName: "",
    userProfilePic: "",
    userBio: "",
  });
  const goBackHome = "/";
  const [value, setValue] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser, refreshPosts } = useContext(AuthGuardContext);
  async function CreateProfileHandle() {
    setIsSubmitting(true);
    try {
      const birthMonth = months.indexOf(inputData.userBirthMonth) + 1;
      const userBirthDate = `${inputData.userBirthYear}-${String(birthMonth).padStart(2, "0")}-${String(inputData.userBirthDay).padStart(2, "0")}`;
      const userCity = await geocodeCityApi(inputData.userCityName);
      const data = await CreateProfileHandleApi({
        ...inputData,
        userBirthDate,
        userCity,
      });
      await loginApi(data.newUser.userEmail, inputData.userPassword);

      router.push("/mainPage");
      await refreshUser();
      await refreshPosts();
    } catch (error) {
      const responseData = error?.response?.data;
      const serverMessage =
        typeof responseData === "string"
          ? responseData
          : responseData?.error ||
            responseData?.message ||
            responseData?.error?.message;
      setError(
        serverMessage ||
          (error?.request
            ? "Cannot reach the account server. Check that the backend is running and its MongoDB Atlas connection is configured."
            : error?.message || "Something went wrong. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  function handleSubmit(event) {
    event.preventDefault();
    CreateProfileHandle();
  }
  useEffect(() => {
    function checkDay() {
      const monthIndex = months.indexOf(month);
      const selectedYear = Number(inputData.userBirthYear) || 2000;
      const updatedDays =
        monthIndex < 0
          ? 31
          : new Date(selectedYear, monthIndex + 1, 0).getDate();
      setDays(updatedDays);
      if (Number(inputData.userBirthDay) > updatedDays) {
        setInputData((previous) => ({ ...previous, userBirthDay: "" }));
      }
    }

    checkDay();
  }, [month, inputData.userBirthYear, inputData.userBirthDay]);
  useEffect(() => {
    function validinputData() {
      const validFullName = /^[A-Za-z]/.test(inputData.userFullName);
      const validUserName = /^[A-Za-z][A-Za-z0-9]*$/.test(inputData.userName);
      const validUserPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%]).{8,}$/.test(
          inputData.userPassword,
        );
      const birthMonth = months.indexOf(inputData.userBirthMonth);
      const birthDate =
        birthMonth >= 0 &&
        inputData.userBirthDay &&
        inputData.userBirthYear
          ? new Date(
              Number(inputData.userBirthYear),
              birthMonth,
              Number(inputData.userBirthDay),
            )
          : null;
      const validBirthDate =
        birthDate instanceof Date &&
        birthDate.getFullYear() === Number(inputData.userBirthYear) &&
        birthDate.getMonth() === birthMonth &&
        birthDate.getDate() === Number(inputData.userBirthDay) &&
        birthDate <= new Date();
      if (
        inputData.userName.length >= 6 &&
        validBirthDate &&
        inputData.userCityName.trim() !== "" &&
        inputData.userFullName !== "" &&
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
  }, [inputData]);
  return (
    <>
      <Container maxWidth="xl" className="createAccountContainer">
        <form
          className="main"
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "700px",
            marginTop: "35px",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit}
        >
          <div className="createAccountCardInfo">
            <Link href={goBackHome}>
              <Mybutton startIcon={<ArrowBackIosIcon />} />
            </Link>
            <Typography
              gutterBottom
              variant="h5"
              style={{ marginTop: "25px", marginLeft: "12px" }}
            >
              Create Account on PathWebSite
            </Typography>

            <Typography
              gutterBottom
              variant="h6"
              style={{ marginTop: "15px", marginLeft: "15px" }}
            >
              email address{" "}
              {error === "" ? null : (
                <span
                  style={{
                    marginTop: "15px",
                    marginLeft: "15px",
                    color: "red",
                  }}
                >
                  {error}
                </span>
              )}
            </Typography>
            <CustomTextFields
              id={"outlined-required"}
              label={"email address"}
              variant={"outlined"}
              type={"email"}
              required={true}
              value={inputData.userEmail || ""}
              onChange={(e) => {
                setInputData((prev) => ({
                  ...prev,
                  userEmail: e.target.value,
                }));
              }}
            />
            <Typography
              gutterBottom
              variant="h6"
              style={{ marginTop: "5px", marginLeft: "15px" }}
            >
              Password
            </Typography>
            <CustomTextFields
              id={"outlined-password-input"}
              label={"Password"}
              type={"password"}
              required={true}
              placeholder={
                "password must be 8 characters and 1 uppercase letter and 1 lowercase letter and @ $ %"
              }
              value={inputData.userPassword || ""}
              onChange={(e) => {
                setInputData((prev) => ({
                  ...prev,
                  userPassword: e.target.value,
                }));
              }}
            />
            <Typography
              gutterBottom
              variant="h6"
              style={{ marginTop: "5px", marginLeft: "15px" }}
            >
              Date of birth
            </Typography>
            {/* Selecter */}
            <div className="SelecterDiv">
              <FormControl
                sx={{ flex: "1 1 150px", minWidth: 120, maxWidth: 180, mr: 1 }}
              >
                <InputLabel id="day-label">Day</InputLabel>
                <Select
                  labelId="day-label"
                  id="day-select"
                  label="Day"
                  value={inputData.userBirthDay || ""}
                  onChange={(e) => {
                    setInputData((prev) => ({
                      ...prev,
                      userBirthDay: e.target.value,
                    }));
                  }}
                  MenuProps={selectMenuProps}
                  required
                >
                  {Array.from({ length: days }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                sx={{ flex: "1 1 150px", minWidth: 120, maxWidth: 180, mr: 1 }}
              >
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                  labelId="month-label"
                  id="month-select"
                  label="Month"
                  value={inputData.userBirthMonth || ""}
                  MenuProps={selectMenuProps}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setInputData((prev) => ({
                      ...prev,
                      userBirthMonth: e.target.value,
                    }));
                  }}
                  required
                >
                  {months.map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                sx={{ flex: "1 1 150px", minWidth: 120, maxWidth: 180 }}
              >
                <InputLabel id="year-label">Year</InputLabel>
                <Select
                  labelId="year-label"
                  id="year-select"
                  label="Year"
                  value={inputData.userBirthYear || ""}
                  onChange={(e) => {
                    setInputData((prev) => ({
                      ...prev,
                      userBirthYear: e.target.value,
                    }));
                  }}
                  MenuProps={selectMenuProps}
                  required
                >
                  {Array.from(
                    { length: new Date().getFullYear() - 1900 + 1 },
                    (_, i) => (
                    <MenuItem key={i + 1900} value={i + 1900}>
                      {i + 1900}
                    </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </div>

            {/* Selecter */}
            <Typography
              gutterBottom
              variant="h6"
              style={{ marginTop: "12px", marginLeft: "15px" }}
            >
              City
            </Typography>
            <CustomTextFields
              id="user-city"
              label="City"
              type="text"
              required
              value={inputData.userCityName}
              onChange={(event) =>
                setInputData((previous) => ({
                  ...previous,
                  userCityName: event.target.value,
                }))
              }
              placeholder="Enter your city"
            />
            <Typography
              gutterBottom
              variant="h6"
              style={{ marginTop: "5px", marginLeft: "15px" }}
            >
              Name
            </Typography>
            <CustomTextFields
              id={"outlined-basic"}
              label={"Full Name"}
              placeholder={"required"}
              type={"text"}
              required={true}
              value={inputData.userFullName || ""}
              onChange={(e) => {
                setInputData((prev) => ({
                  ...prev,
                  userFullName: e.target.value,
                }));
              }}
            />
            <Typography
              gutterBottom
              variant="h6"
              style={{ marginTop: "5px", marginLeft: "15px" }}
            >
              Username
            </Typography>
            <CustomTextFields
              id={"outlined-basic"}
              label={"Username"}
              placeholder={"Username must be 8 character"}
              type={"text"}
              required={true}
              value={inputData.userName || ""}
              onChange={(e) => {
                setInputData((prev) => ({ ...prev, userName: e.target.value }));
              }}
            />
            <Mybutton
              name={"signup"}
              variant={"contained"}
              className={"btn"}
              type={"submit"}
              disabled={value || isSubmitting}
            />
          </div>
        </form>
      </Container>
    </>
  );
}
