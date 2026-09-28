"use client";
import { Card, Typography, Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CommentIcon from "@mui/icons-material/Comment";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { alertDialogContext } from "../Context/alertDialogContext";
import { CommentDialogContext } from "../Context/commentDialogContext";
import { AuthGuardContext } from "../Context/AuthGuardContext";
import Link from "next/link";
import C_Avatar from "./C_Avatar";
import { handleDeletePostApi, handleAddPostLikeApi } from "../api/posts";
import { getUserByIdApi } from "../api/users";
import SharePostDialog from "./SharePostDialog";
import { useSocket } from "../Context/SocketContext";
function PostItem({
  p,
  user,
  setInfo,
  handleOpen,
  handleClickOpen,
  setPostId,
  refreshPosts,
  setPosts,
}) {
  const [profileUser, setProfileUser] = useState("");
  console.log(p)
  useEffect(() => {
    async function checkUserName() {
      try {
        const res = await getUserByIdApi(p.userId);

        setProfileUser(res);
      } catch (error) {
        console.log(error);
      }
    }
    checkUserName();
  }, [p.userId]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const author = profileUser;
  const authorProfilePic = author ? author.userProfilePic : undefined;
  const authorName = author ? author.userName : "Unknown User";
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
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
  const like = useMemo(() => {
    return p?.likes?.some((like) => like.userId === user?._id);
  }, [p?.likes, user?._id]);
  const handleMute = (event) => {
    event.stopPropagation();

    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };
  function handleDeletPost({ postId }) {
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
          console.log(error);
        }
      },
    });
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
    <div className="postContainer">
      <Card
        sx={{
          width: "100%",
          maxWidth: 470,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#1f2024",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.28)",
          mb: 3,
        }}
      >
        <CardHeader
          sx={{
            px: 2,
            py: 1.25,
            "& .MuiCardHeader-title": {
              color: "white",
              fontSize: "0.95rem",
              fontWeight: 600,
            },
            "& .MuiCardHeader-subheader": {
              color: "#9ca3af",
              fontSize: "0.8rem",
            },
          }}
          avatar={
            <>
              {" "}
              <C_Avatar
                authorName={authorName}
                authorProfilePic={authorProfilePic}
                LinkTogo={`/mainPage/${profileUser?.userName}`}
              />
              <Typography
                variant="caption"
                className="timestamp"
                sx={{ ml: 1,mt:1 }}
              >
                {p?.createdAt
                  ? formatRelativeTime(p.createdAt)
                  : "Just now"}
              </Typography>
            </>
          }
          action={
            <div>
              <IconButton
                aria-label="settings"
                aria-controls={open ? `menu-${p.idPost}` : undefined}
                aria-expanded={open}
                onClick={handleClick}
                sx={{ color: "#d1d5db" }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id={`menu-${p.idPost}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
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
                    handleDeletPost({ postId: p._id });
                    handleOpen();
                    handleClose();
                  }}
                >
                  delete
                </MenuItem>
              </Menu>
            </div>
          }
          subheader={p.data}
        />
        {p.mediaType === "video" ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "9 / 16",
              maxHeight: "75vh",
              overflow: "hidden",
              bgcolor: "#000",
            }}
            onClick={() => {
              handleClickOpen();
              setPostId(p._id);
            }}
          >
            <Box
              ref={videoRef}
              component="video"
              src={p.media}
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
                {p.postCaption}
              </Typography>
            </Box>
          </Box>
        ) : (
          <CardMedia
            component="img"
            height="auto"
            sx={{
              maxHeight: 480,
              objectFit: "cover",
            }}
            image={p.media || "https://via.placeholder.com/470x300"}
            alt="post Share"
          />
        )}
        <CardActions
          disableSpacing
          sx={{
            px: 2,
            pb: 1.5,
            pt: 1.25,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
          }}
        >
          <IconButton
            aria-label="add to favorites"
            onClick={() => {
              handleAddlike(p._id);
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
              {p.likes?.length ?? 0}
            </Typography>
          </IconButton>
          <IconButton
            aria-label="Comment"
            sx={{ color: "#9ca3af", borderRadius: "999px" }}
          >
            <CommentIcon
              onClick={() => {
                handleClickOpen();
                setPostId(p._id);
              }}
            />
            <Typography
              component="span"
              variant="caption"
              sx={{
                display: "block",
                color: "#8f9197",
                marginTop: "4px",
                marginLeft: "6px",
              }}
            >
              {p?.comments?.length}
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
              {p.shares?.length ?? 0}
            </Typography>
          </IconButton>
        </CardActions>
        <Divider />

        <Typography
          component="div"
          variant="caption"
          sx={{
            display: "block",
            color: "#8f9197",
            marginTop: "4px",
            padding: "8px 16px 16px",
          }}
        >
          <Link href={`/mainPage/${profileUser?.userName}`}>
            <Typography
              component="span"
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {profileUser.userName}
            </Typography>
          </Link>{" "}
          {p.postCaption}
        </Typography>
      </Card>
      <SharePostDialog
        open={shareDialogOpen}
        post={p}
        onClose={() => setShareDialogOpen(false)}
        onShared={(updatedPost) =>
          setPosts((currentPosts) =>
            currentPosts.map((post) =>
              post._id === updatedPost._id ? updatedPost : post,
            ),
          )
        }
      />
    </div>
  );
}

export default function Post() {
  const { currentUser, posts, setPosts, refreshPosts } =
    useContext(AuthGuardContext);
  const { socket } = useSocket();
  const { setInfo, handleOpen } = useContext(alertDialogContext);
  const { handleClickOpen, setPostId } = useContext(CommentDialogContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    function IsMounted() {
      setIsMounted(true);
    }
    IsMounted();
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    const handlePostSharesUpdated = ({ _id, shares }) => {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === _id ? { ...post, shares } : post,
        ),
      );
    };
    socket.on("post:shares-updated", handlePostSharesUpdated);
    return () => socket.off("post:shares-updated", handlePostSharesUpdated);
  }, [socket, setPosts]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {posts && posts?.length > 0 ? (
        posts?.map((p) => (
          <PostItem
            key={p?._id}
            p={p}
            user={currentUser}
            setInfo={setInfo}
            handleOpen={handleOpen}
            handleClickOpen={handleClickOpen}
            setPostId={setPostId}
            refreshPosts={refreshPosts}
            setPosts={setPosts}
          />
        ))
      ) : (
        <Typography component="div" sx={{ color: "#9ca3af", p: 2 }}>
          No posts found.
        </Typography>
      )}
    </>
  );
}
