"use client";
import { Card, Typography, Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CommentIcon from "@mui/icons-material/Comment";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CreateProfile } from "../Context/CreateProfileContext";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { alertDialogContext } from "../Context/alertDialogContext";
import { CommentDialogContext } from "../Context/commentDialogContext";
function PostItem({ p, state, dispatch, idUser, user, setInfo, handleOpen ,handleClickOpen,setPostId}) {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handlelPost(event, idPost, userId) {
    dispatch({ type: event, payload: { userId, idPost } });
  }

  const author = state.users?.find((u) => u.userId === p.idUser);
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

  const handleMute = (event) => {
    event.stopPropagation();

    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };
  const like = useMemo(() => {
    return p.likedCount.some((like) => like.userId === user.userId);
  }, [p.likedCount, user.userId]);
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
            <Avatar
              alt={authorName}
              src={authorProfilePic}
              sx={{ width: 40, height: 40, border: "2px solid #2c2f36" }}
            />
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
                    setInfo({
                      Title: "Deleting The Post!!",
                      Name: "Do You Want To Delete The Post?",
                      alertName: "Delete",
                      type: "deletePost",
                      colorBtn: "red !important",
                      payload: { idPost: p.idPost, idUser },
                    });
                    handleOpen();
                    handleClose();
                  }}
                >
                  delete
                </MenuItem>
              </Menu>
            </div>
          }
          title={authorName}
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
              handlelPost("postLiked", p.idPost, user.userId);
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
              {p.likedCount?.length ?? 0}
            </Typography>
          </IconButton>
          <IconButton
            aria-label="Comment"
            sx={{ color: "#9ca3af", borderRadius: "999px" }}
          >
            <CommentIcon onClick={()=>{
              handleClickOpen()
              setPostId(p.idPost)
            }} />
            <Typography
              component="span"
              variant="caption"
              sx={{
                display: "block",
                color: "#8f9197",
                marginTop: "4px",
              }}
            >
              {p?.CommentCount.length}
            </Typography>
          </IconButton>
          <IconButton
            aria-label="share"
            sx={{ color: "#9ca3af", borderRadius: "999px" }}
            onClick={() => {
                handlelPost("postShare", p.idPost, user.userId);
              }}
          >
            <ShareIcon  />
            <Typography
              component="span"
              variant="caption"
               
              sx={{
                display: "block",
                color: "#8f9197",
                marginTop: "4px",
              }}
             
            >
              {p.ShareCount?.length??0}
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
          <Typography
            component="span"
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {state.users.map((u) => {
              return u.userId === p.idUser ? u.userName : "";
            })}
          </Typography>{" "}
          {p.postCaption}
        </Typography>
      </Card>
    </div>
  
  
  );
}

export default function Post() {
  const { state, dispatch } = useContext(CreateProfile);
  const { idUser } = state.posts?.[0] || {};
  const user = state.users?.[0] || {};
  const { setInfo, handleOpen } = useContext(alertDialogContext);
 const {handleClickOpen,setPostId} =useContext(CommentDialogContext)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    function IsMounted() {
      setIsMounted(true);
    }
    IsMounted();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {state?.posts && state.posts?.length > 0 ? (
        state.posts?.map((p) => (
          <PostItem
            key={p?.idPost}
            p={p}
            state={state}
            dispatch={dispatch}
            idUser={idUser}
            user={user}
            setInfo={setInfo}
            handleOpen={handleOpen}
            handleClickOpen={handleClickOpen}
            setPostId={setPostId}
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
