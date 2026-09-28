"use client";
import { Typography, Box, Dialog, CardMedia, Divider } from "@mui/material";
import "../styles/mainPageStyle.css";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { styled } from "@mui/material/styles";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useContext, useRef, useMemo, useState, useEffect } from "react";
import { CommentDialogContext } from "../Context/commentDialogContext";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Button from "@mui/material/Button";
import DehazeRoundedIcon from "@mui/icons-material/DehazeRounded";
import { alertDialogContext } from "../Context/alertDialogContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AuthGuardContext } from "../Context/AuthGuardContext";
import C_Avatar from "./C_Avatar";
import {
  handleDeleteCommentApi,
  handleLikeCommentApi,
  handleAddCommentApi,
  handleDeletePostApi,
  handleAddPostLikeApi,
} from "../api/posts";
import { getUserByIdApi } from "../api/users";
import SharePostDialog from "./SharePostDialog";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
  "& .MuiPaper-root": {
    display: "flex",
    backgroundColor: "rgb(35, 34, 34)",
    color: "white",
    maxWidth: "1300px",
    maxHeight: "1300px",
    width: "70rem",
    height: "86vh",
    borderRadius: "10px",
  },
  "& .MuiDialog-paper": {
    overflowY: "hidden !important",
    overflowX: "hidden !important",
  },

  "& .mui-ujudvl-MuiTypography-root-MuiDialogContentText-root": {
    color: "white",
  },
  "& .MuiButtonBase-root": {
    color: "white",
    fontWeight: "600",
  },
}));
function CommentItem({
  comment,
  postId,
  currentUser,
  setPosts,
  handleOpen,
  setInfo,
}) {
  const [authors, setAuthors] = useState({});
  const [expandedCommentId, setExpandedCommentId] = useState(null);

  useEffect(() => {
    async function getAuthors() {
      try {
        const res = await getUserByIdApi(comment.userId);

        setAuthors(res);
      } catch (error) {
        console.log(error);
      }
    }

    getAuthors();
  }, [comment.userId]);
  const authorName = authors ? authors.userName : "Unknown User";
  const authorProfilePic = authors ? authors.userProfilePic : undefined;
  let LIMIT = 30;
  const isExpanded = expandedCommentId === comment?._id;
  const isLongText = comment?.content?.length > LIMIT;
  const like = comment?.likes?.some((like) => like.userId === currentUser);
  const displayedText = () => {
    if (!isLongText || isExpanded) return comment?.content;
    return comment?.textComment.slice(0, LIMIT) + "...";
  };

  const handleDeleteComment = (postId, commentId) => {
    if (!comment?.userId) return;
    setInfo({
      Title: "Delete the Comment!",
      Name: "Are You Sure you Want To Delete The Comment? ",
      alertName: "Delete",
      type: "deleteComment",
      payload: async () => {
        try {
          const res = await handleDeleteCommentApi(postId, commentId);

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === res.updatedPost._id ? res.updatedPost : post,
            ),
          );
        } catch (error) {
          console.error(
            "Error deleting comment:",
            error.response?.data?.message || error.message,
          );
        }
      },
      colorBtn: "red !important",
    });
    handleOpen();
  };

  async function handleLikeComment(postId, commentId) {
    try {
      const res = await handleLikeCommentApi(postId, commentId);
      console.log(res);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === res._id ? res : post)),
      );
    } catch (error) {
      console.error(
        "Error toggling comment like:",
        error.response?.data?.message || error.message,
      );
    }
  }
  function formatRelativeTime(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    const elapsed = now - past;

    if (elapsed < msPerMinute) {
      const seconds = Math.round(elapsed / 1000);
      return `${seconds <= 0 ? 1 : seconds}s ago`;
    }
    if (elapsed < msPerHour) {
      return `${Math.round(elapsed / msPerMinute)}m ago`;
    }
    if (elapsed < msPerDay) {
      return `${Math.round(elapsed / msPerHour)}h ago`;
    }
    return `${Math.round(elapsed / msPerDay)}d ago`;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        marginBottom: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <C_Avatar
          authorName={authorName}
          authorProfilePic={authorProfilePic}
          LinkTogo={`/mainPage/${authors?.userName}`}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1,

            width: 0,
            ml: 1,
          }}
        >
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <Typography
              component="span"
              sx={{
                ml: 1,
                whiteSpace: "normal",
                overflowWrap: "break-word",
                wordBreak: "normal",
              }}
            >
              {displayedText()}
            </Typography>
          </Box>

          {isLongText && (
            <Button
              size="small"
              onClick={() =>
                setExpandedCommentId(isExpanded ? null : comment?._id)
              }
              sx={{
                p: 0,
                minWidth: "auto",
                color: "#3b82f6",
              }}
            >
              {isExpanded ? "Show Less" : "Read More"}
            </Button>
          )}
        </Box>

        <IconButton
          aria-label="add to favorites"
          sx={{
            alignSelf: "flex-start",
          }}
          onClick={() => {
            handleLikeComment(postId, comment._id);
          }}
        >
          <FavoriteIcon
            sx={{
              color: like ? "#ff4d67" : "#9ca3af",
            }}
          />
          <Typography
            component="span"
            variant="caption"
            sx={{
              display: "block",
              color: "#9ca3af",
              marginLeft: "6px",
            }}
          >
            {comment?.likes?.length ?? 0}
          </Typography>
        </IconButton>
      </div>
      <Typography variant="caption" className="timestamp" sx={{ ml: 7 }}>
        {comment?.createdAt
          ? formatRelativeTime(comment.createdAt)
          : "Just now"}{" "}
        {`${comment?.likes.length} likes`}{" "}
        <Button
          sx={{
            "& .mui-bi4xh5-MuiButtonBase-root-MuiButton-root": {
              padding: "0px",
            },
            padding: "0px",
          }}
          endIcon={<DehazeRoundedIcon />}
          onClick={() => {
            handleDeleteComment(postId, comment._id);
          }}
        />
      </Typography>
    </Box>
  );
}
export default function CommentDialog() {
  const { open, handleClose, postId } = useContext(CommentDialogContext);
  const { currentUser, posts, setPosts, refreshPosts } =
    useContext(AuthGuardContext);

  const post = useMemo(
    () => posts?.find((p) => p?._id === postId),
    [postId, posts],
  );
  const [profileUser, setProfileUser] = useState("");

  const currentActivePost = posts?.find((p) => p?._id === post?._id);
  useEffect(() => {
    async function checkUserName() {
      try {
        const res = await getUserByIdApi(post.userId);

        setProfileUser(res);
      } catch (error) {
        console.log(error);
      }
    }
    checkUserName();
  }, [post?.userId]);

  const [anchorEl, setAnchorEl] = useState(null);
  const openN = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseD = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;

  const author = profileUser;
  const authorName = author ? author.userName : "Unknown User";
  const authorProfilePic = author ? author.userProfilePic : undefined;

  const like = post?.likes?.some((like) => like.userId === currentUser?._id);

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [content, setContent] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { handleOpen, setInfo } = useContext(alertDialogContext);
  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMute = (event) => {
    event.stopPropagation();

    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };
  const handleEmojiClick = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  async function handleAddComment(postId, content) {
    try {
      const res = await await handleAddCommentApi(postId, content);
      setPosts((prevPost) =>
        prevPost.map((post) => (post._id == res._id ? res : post)),
      );
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response?.data || error.message,
      );
    }
  }
  async function handleAddlike(postId) {
    try {
      const res = await handleAddPostLikeApi(postId);
      setPosts((prevPost) =>
        prevPost.map((post) => (post._id == res._id ? res : post)),
      );
    } catch (error) {
      console.error(
        "Error adding Like:",
        error.response?.data || error.message,
      );
    }
  }

  return (
    <>
      <BootstrapDialog open={open} onClose={handleClose} disableScrollLock>
        <Box
          style={{
            width: "100%",
            maxWidth: "auto",
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "#1f2024",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.28)",
            display: "flex",
            mb: 3,
            height: "100vh",
            maxHeight: "100vh",
          }}
        >
          {post?.mediaType === "video" ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "9 / 16",
                maxHeight: "86vh",
                overflow: "hidden",
                bgcolor: "#000",
              }}
            >
              <Box
                ref={videoRef}
                component="video"
                src={post?.media}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onClick={handleVideoClick}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  cursor: "pointer",
                }}
              />

              {/* Play icon when video is paused */}
              {!isPlaying && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.45)",
                  }}
                >
                  <PlayArrowIcon
                    sx={{
                      color: "white",
                      fontSize: 40,
                    }}
                  />
                </Box>
              )}

              {/* Instagram-style mute button */}
              <IconButton
                onClick={handleMute}
                sx={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  width: 38,
                  height: 38,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.55)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                  zIndex: 2,
                }}
              >
                {isMuted ? (
                  <VolumeOffIcon sx={{ fontSize: 22 }} />
                ) : (
                  <VolumeUpIcon sx={{ fontSize: 22 }} />
                )}
              </IconButton>

              {/* Bottom information */}
              <Box
                sx={{
                  position: "absolute",
                  left: 16,
                  right: 60,
                  bottom: 15,
                  color: "white",
                  pointerEvents: "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {post?.postCaption}
                </Typography>
              </Box>
            </Box>
          ) : (
            <CardMedia
              component="img"
              height="auto"
              sx={{
                maxHeight: 680,
                maxWidth: 575,
                objectFit: "cover",
              }}
              image={post?.media || "https://via.placeholder.com/470x300"}
              alt="post Share"
            />
          )}
          <div
            style={{
              px: 2,
              pb: 1.5,
              pt: 1.25,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "start",
              width: "70rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#8f9197",
                mb: 0.5,
              }}
            >
              <C_Avatar
                authorName={authorName}
                authorProfilePic={authorProfilePic}
                LinkTogo={`/mainPage/${profileUser?.userName}`}
              />
              <Typography
                component="div"
                variant="caption"
                sx={{ color: "#fff" }}
              >
                {post?.postCaption}
              </Typography>
              <div>
                <IconButton
                  aria-label="settings"
                  aria-controls={openN ? `menu-${post?.idPost}` : undefined}
                  aria-expanded={openN}
                  onClick={handleClick}
                  sx={{ color: "#d1d5db" }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id={`menu-${post?.idPost}`}
                  anchorEl={anchorEl}
                  open={openN}
                  onClose={handleCloseD}
                  disableScrollLock
                  slotProps={{
                    backdrop: {
                      sx: {
                        backgroundColor: "transparent",
                      },
                    },
                    paper: {
                      sx: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                        backgroundColor: "#24262c",
                        color: "#fff",
                        border: "none",
                        overflow: "hidden",
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setInfo({
                        Title: "Deleting The Post!!",
                        Name: "Do You Want To Delete The Post?",
                        alertName: "Delete",
                        type: "deletePost",
                        colorBtn: "red !important",
                        payload: async () => {
                          try {
                            await handleDeletePostApi(postId);

                            await refreshPosts();
                          } catch (error) {
                            console.error(
                              "Error deleting comment:",
                              error.response?.data?.message || error.message,
                            );
                          }
                        },
                        functionHandle: handleClose,
                      });
                      handleOpen();
                      handleCloseD();
                    }}
                  >
                    delete
                  </MenuItem>
                </Menu>
              </div>
            </Box>
            <Divider
              sx={{
                width: "100%",
                my: 1,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                width: "100%",
                overflow: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                marginBottom: "auto",
              }}
            >
              {currentActivePost?.comments.map((c) => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  postId={post?._id}
                  currentUser={currentUser?._id}
                  setPosts={setPosts}
                  handleOpen={handleOpen}
                  setInfo={setInfo}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                aria-label="add to favorites"
                onClick={() => {
                  handleAddlike(post?._id);
                }}
              >
                <FavoriteIcon
                  sx={{
                    color: like ? "#ff4d67" : "#9ca3af",
                    borderRadius: "999px",
                  }}
                />
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#9ca3af",
                    marginLeft: "6px",
                  }}
                >
                  {post?.likes?.length ?? 0}
                </Typography>
              </IconButton>

              <IconButton
                aria-label="share"
                sx={{ color: "#9ca3af", borderRadius: "999px" }}
                onClick={() => {
                  setShareDialogOpen(true);
                }}
              >
                <ShareIcon />
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#8f9197",
                    marginTop: "4px",
                  }}
                >
                    {post?.shares?.length ?? 0}
                </Typography>
              </IconButton>
              <Typography
                variant="caption"
                className="timestamp"
                sx={{ ml: 0 }}
              >
                {post?.createdAt.split("T")[0]}
              </Typography>
            </div>
            <Divider
              sx={{
                width: "100%",
                my: 1,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            />
            <div style={{ display: "flex" }}>
              <TextField
                size="small"
                value={content}
                placeholder="Add a comment…"
                sx={{
                  "& .MuiInputBase-root": {
                    width: "550px !important",
                    marginBottom: "5px",
                    marginTop: "5px",
                    borderRadius: "0px",
                    paddingLeft: "0px",
                  },

                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
                onChange={(e) => {
                  setContent(e.target.value);
                  setEmojiOpen(!open);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          color="inherit"
                          onClick={() => setEmojiOpen((prev) => !prev)}
                        >
                          <EmojiEmotionsIcon />
                        </IconButton>
                        {emojiOpen && (
                          <Box className="emojiPicker">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                          </Box>
                        )}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="text"
                          disabled={!content}
                          onClick={() => {
                            handleAddComment(post?._id, content);
                            setContent("");
                          }}
                          sx={{
                            "&.MuiButtonBase-root": {
                              padding: "0px",
                            },
                          }}
                        >
                          Post
                        </Button>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          </div>
        </Box>
      </BootstrapDialog>
      <SharePostDialog
        open={shareDialogOpen}
        post={post}
        onClose={() => setShareDialogOpen(false)}
        onShared={(updatedPost) =>
          setPosts((currentPosts) =>
            currentPosts.map((currentPost) =>
              currentPost._id === updatedPost._id ? updatedPost : currentPost,
            ),
          )
        }
      />
    </>
  );
}
