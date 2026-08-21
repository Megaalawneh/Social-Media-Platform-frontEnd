"use client";
import React, { useContext, useState,useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import "../../styles/mainPageStyle.css";
import PageLayout from "../../components/PageLayout";
import {

  CreateProfile,
} from "../../Context/CreateProfileContext";
import { AlertDialogProvider } from "../../Context/alertDialogContext";
import Link from "next/link";
function SearchContent() {
  const [inputData, setInputData] = useState("");
  const { state, dispatch } = useContext(CreateProfile);
  const results = state.Search ?? [];
  function handleSearch(value) {
    setInputData(value);
    dispatch({
      type: "SearchProfile",
      payload: { inputData: value },
    });
  }
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    function moun() {
      setIsMounted(true);
    }
    moun();
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="searchContainer">
      <TextField
        className="TextFieldSearch"
        size="small"
        value={inputData}
        onChange={(event) => handleSearch(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ width: "100%", maxWidth: 400 }}>
        {results ? (
          results.map((user) => (
            <Link key={user.userId} href={`/mainPage/${user.userName}`}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center", marginTop: "30px" }}
              >
                <Avatar
                  alt={user.userName}
                  src={user.userProfilePic}
                  sx={{ width: 50, height: 50 }}
                />

                <div style={{ color: "rgb(165, 154, 154)" }}>
                  <Typography variant="h5">{user.userName}</Typography>
                  <Typography variant="h6">{user.userFullName}</Typography>
                </div>
              </Stack>
            </Link>
          ))
        ) : (
          <div></div>
        )}

        {inputData && results.length === 0 && (
          <Typography sx={{ mt: 3 }}>No users found.</Typography>
        )}
      </Box>
    </div>
  );
}

export default function Page() {
  return (
  
      <AlertDialogProvider>
        <PageLayout>
          <SearchContent />
        </PageLayout>
      </AlertDialogProvider>

  );
}
