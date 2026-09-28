"use client";
import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import "../../styles/mainPageStyle.css";
import PageLayout from "../../components/PageLayout";
import { AlertDialogProvider } from "../../Context/alertDialogContext";
import Link from "next/link";
import { searchUserNameApi } from "../../api/users";
function SearchContent() {
  const [inputData, setInputData] = useState("");
  const [results, setResults] = useState([]);
  const searchRequestId = useRef(0);

  async function handleSearch(value) {
    setInputData(value);
    const requestId = ++searchRequestId.current;
    const searchTerm = value.trim();
    if (!searchTerm) {
      setResults([]);
      return;
    }

    try {
      const res = await searchUserNameApi(searchTerm);
      if (requestId === searchRequestId.current) {
        setResults(res);
      }
    } catch (error) {
      if (requestId === searchRequestId.current) {
        setResults([]);
        console.error(
          "User search failed:",
          error.response?.status,
          error.response?.data || error.message,
        );
      }
    }
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
            <Link key={user._id} href={`/mainPage/${user.userName}`}>
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
