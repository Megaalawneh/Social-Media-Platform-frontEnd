"use client";
import { Card, Typography } from "@mui/material";
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
import { CreateProfile } from "../Context/CreateProfileContext";
import { useContext, useState, useEffect } from "react";
import { alertDialogContext } from "../Context/alertDialogContext";

function PostItem({ p, state, dispatch, idUser, user, setInfo, handleOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handlelikePost(event, idPost, userId) {
    dispatch({ type: event, payload: { userId, idPost } });
  }

  const author = state.users?.find((u) => u.userId === p.idUser);
  const authorName = author ? author.userName : "Unknown User";
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
    <div className="postContainer">
      <Card
        sx={{
          width: "100%",
          maxWidth: 470,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#1f2024",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.28)",
          mb: 3, // spacing between stacked items
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
              src={p.ProfilePic}
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
              handlelikePost("postLiked", p.idPost, user.userId);
            }}
          >
            <FavoriteIcon
              sx={{
                color: p.liked ? "#ff4d67" : "#9ca3af",
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
              {p.likedCount}
            </Typography>
          </IconButton>
          <IconButton
            aria-label="Comment"
            sx={{ color: "#9ca3af", borderRadius: "999px" }}
          >
            <CommentIcon />
            <Typography
              component="span"
              variant="caption"
              sx={{
                display: "block",
                color: "#8f9197",
                marginTop: "4px",
              }}
            >
              {p.CommentCount}
            </Typography>
          </IconButton>
          <IconButton
            aria-label="share"
            sx={{ color: "#9ca3af", borderRadius: "999px" }}
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
              {p.ShareCount}
            </Typography>
          </IconButton>
        </CardActions>
        <Divider />

        {/* Outer text container must be a div block to allow inline child elements */}
        <Typography
          component="div"
          variant="body2"
          sx={{
            display: "block",
            color: "#8f9197",
            padding: "12px 16px 16px",
          }}
        >
          <Typography
            component="span"
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#fff",
              marginRight: "6px",
            }}
          >
            {authorName}
          </Typography>
          {p.caption || p.data}
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

  return (
    <>
      {state.posts && state.posts.length > 0 ? (
        state.posts.map((p) => (
          <PostItem
            key={p.idPost}
            p={p}
            state={state}
            dispatch={dispatch}
            idUser={idUser}
            user={user}
            setInfo={setInfo}
            handleOpen={handleOpen}
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
