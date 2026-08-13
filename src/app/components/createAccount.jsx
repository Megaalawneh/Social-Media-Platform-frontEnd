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
import { useEffect, useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import { CreateProfile } from "../Context/CreateProfileContext";
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
  const [month, setMonth] = useState("");
  const [days, setDays] = useState(31);
  const goBackHome = "/";
  const { inputData, setInputData, dispatch } = useContext(CreateProfile);
  const [value, setValue] = useState(true);
  function CreateProfileHandle(event) {
    dispatch({ type: event, payload: { inputData } });
  }

  function handleSubmit(event) {
    event.preventDefault();
    CreateProfileHandle("createProfile");
  }
  useEffect(() => {
    function checkDay() {
      if (month === "January") {
        setDays(31);
      } else if (month === "February") {
        setDays(28);
      } else if (month === "March") {
        setDays(31);
      } else if (month === "April") {
        setDays(30);
      } else if (month === "May") {
        setDays(31);
      } else if (month === "June") {
        setDays(30);
      } else if (month === "July") {
        setDays(31);
      } else if (month === "August") {
        setDays(31);
      } else if (month === "September") {
        setDays(30);
      } else if (month === "October") {
        setDays(31);
      } else if (month === "November") {
        setDays(30);
      } else if (month === "December") {
        setDays(31);
      }
    }

    checkDay();
  }, [month]);
  useEffect(() => {
    function validinputData() {
      const validFullName = /^[A-Za-z]/.test(inputData.userFullName);
      const validUserName = /^[A-Za-z][A-Za-z0-9]*$/.test(inputData.userName);
      const validUserPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%]).{8,}$/.test(
          inputData.userPassword,
        );
      if (
        inputData.userName.length >= 6 &&
        inputData.userBirthDay !== "" &&
        inputData.userBirthMonth !== "" &&
        inputData.userBirthYear !== "" &&
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
              email address or username
            </Typography>
            <CustomTextFields
              id={"outlined-required"}
              label={"email address or username"}
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
              placeholder={"password must be 8 characters and 1 uppercase letter and 1 lowercase letter and @ $ %"}
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
                  {Array.from({ length: 2030 - 1900 + 1 }, (_, i) => (
                    <MenuItem key={i + 1900} value={i + 1900}>
                      {i + 1900}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Selecter */}
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
              disabled={value}
            />
          </div>
        </form>
      </Container>
    </>
  );
}
