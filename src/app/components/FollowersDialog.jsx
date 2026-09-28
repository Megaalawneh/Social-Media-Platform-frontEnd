import Dialog from "@mui/material/Dialog";
import { useContext, useState, useEffect } from "react";
import { FollowersDialogContext } from "../Context/FollowersDialogContext";
import { Typography, Divider, TextField, Button, Box } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { useParams } from "next/navigation";
import { AuthGuardContext } from "../Context/AuthGuardContext";
import { getUserByIdApi, checkUserNameApi } from "../api/users";
import C_Avatar from "./C_Avatar";
export default function FollowersDialog() {
  const { open, handleClose, value } = useContext(FollowersDialogContext);

  const params = useParams();
  const { userId } = params;
  const [profileUser, setProfileUser] = useState("");
  const [authors, setAuthors] = useState({});
  const [search, setSearch] = useState("");
  const { currentUser } = useContext(AuthGuardContext);

  useEffect(() => {
    async function getAuthors() {
      const users =
        value === "followers"
          ? profileUser?.followers || []
          : profileUser?.following || [];

      const uniqueUserIds = [
        ...new Set(
          users.map((user) =>
            value === "followers" ? user.userFollower : user.userfollowing,
          ),
        ),
      ];

      try {
        const results = await Promise.all(
          uniqueUserIds.map(async (id) => {
            const res = await getUserByIdApi(id);

            return {
              id,
              user: res,
            };
          }),
        );

        const authorsObject = {};

        results.forEach(({ id, user }) => {
          authorsObject[id] = user;
        });

        setAuthors(authorsObject);
      } catch (error) {
        console.log(error);
      }
    }

    if (profileUser) {
      getAuthors();
    }
  }, [profileUser, value]);
  useEffect(() => {
    function check() {
      setSearch("");
    }
    check();
  }, [value]);
  useEffect(() => {
    async function checkUserName() {
      try {
        const res = await checkUserNameApi(userId);
        setProfileUser(res);
      } catch (error) {
        console.log(error);
      }
    }
    checkUserName();
  }, [userId]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
        sx={{
          "& .mui-uq7k9j-MuiPaper-root-MuiDialog-paper": {
            overflowY: "hidden",
          },
        }}
      >
        {value === "followers" ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "70vh",
                width: "540px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {" "}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#ededee",
                      marginLeft: "6px",
                      fontSize: "16px",
                    }}
                  >
                    Followers
                  </Typography>
                </div>
                <IconButton
                  aria-label="delete"
                  size="medium"
                  sx={{ color: "white" }}
                  onClick={handleClose}
                >
                  <ClearIcon fontSize="inherit" />
                </IconButton>
              </div>
              <Divider
                sx={{
                  width: "100%",
                  my: 1,
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              />
              <div>
                <TextField
                  className="TextFieldSearch"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      width: "520px !important",
                      marginLeft: "10px",
                    },

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    maxHeight: "400px",
                  }}
                >
                  {profileUser?.followers
                    ?.filter((u) => {
                      const author = authors[u.userFollower];

                      return (
                        author?.userName
                          ?.toLowerCase()
                          .includes(search.toLowerCase()) ||
                        author?.userFullName
                          ?.toLowerCase()
                          .includes(search.toLowerCase())
                      );
                    })
                    .map((u, index) => {
                      const author = authors[u.userFollower];

                      const authorProfilePic = author
                        ? author.userProfilePic
                        : undefined;

                      const authorName = author
                        ? author.userName
                        : "Unknown User";

                      return (
                        <div
                          key={u?._id || `${u?.userFollower}-${index}`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "15px 0px 10px 10px ",
                          }}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <C_Avatar
                              authorName={authorName}
                              authorProfilePic={authorProfilePic}
                              LinkTogo={`/mainPage/${author?.userName}`}
                            />
                          </div>
                          {currentUser?._id ===
                          u.userFollower ? null : currentUser?.following?.some(
                              (f) => f.userfollowing === u.userFollower,
                            ) ? (
                            <Button
                              variant="contained"
                              sx={{
                                margin: "0px 5px 0px 0px",
                                width: "70px",
                                height: "30px",
                                fontSize: "11px",
                                backgroundColor: "#25292e",
                              }}
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              sx={{
                                margin: "0px 5px 0px 0px",
                                width: "70px",
                                height: "30px",
                                fontSize: "11px",
                                backgroundColor: "#0a68dc",
                              }}
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      );
                    })}
                </Box>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "70vh",
                width: "540px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {" "}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#ededee",
                      marginLeft: "6px",
                      fontSize: "16px",
                    }}
                  >
                    Following
                  </Typography>
                </div>
                <IconButton
                  aria-label="delete"
                  size="medium"
                  sx={{ color: "white" }}
                  onClick={handleClose}
                >
                  <ClearIcon fontSize="inherit" />
                </IconButton>
              </div>
              <Divider
                sx={{
                  width: "100%",
                  my: 1,
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              />
              <div>
                <TextField
                  className="TextFieldSearch"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      width: "520px !important",
                      marginLeft: "10px",
                    },

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    maxHeight: "400px",
                  }}
                >
                  {profileUser?.following
                    ?.filter((u) => {
                      const author = authors[u.userfollowing];

                      return (
                        author?.userName
                          ?.toLowerCase()
                          .includes(search.toLowerCase()) ||
                        author?.userFullName
                          ?.toLowerCase()
                          .includes(search.toLowerCase())
                      );
                    })
                    .map((u, index) => {
                      const author = authors[u.userfollowing];

                      const authorProfilePic = author
                        ? author.userProfilePic
                        : undefined;

                      const authorName = author
                        ? author.userName
                        : "Unknown User";

                      return (
                        <div
                          key={u?._id || `${u?.userfollowing}-${index}`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "15px 0px 10px 10px ",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <C_Avatar
                              authorName={authorName}
                              authorProfilePic={authorProfilePic}
                              LinkTogo={`/mainPage/${author?.userName}`}
                            />
                          </div>
                          {currentUser?._id ===
                          u.userfollowing ? null : currentUser?.following?.some(
                              (f) => f.userfollowing === u.userfollowing,
                            ) ? (
                            <Button
                              variant="contained"
                              sx={{
                                margin: "0px 5px 0px 0px",
                                width: "70px",
                                height: "30px",
                                fontSize: "11px",
                                backgroundColor: "#25292e",
                              }}
                            >
                              Following
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              sx={{
                                margin: "0px 5px 0px 0px",
                                width: "70px",
                                height: "30px",
                                fontSize: "11px",
                                backgroundColor: "#0a68dc",
                              }}
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      );
                    })}
                </Box>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
}
