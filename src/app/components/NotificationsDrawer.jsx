import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useContext, useEffect, useState, useMemo } from "react";
import { NotificationsDrawerContext } from "../Context/NotificationsDrawerContext";
import { Typography, Button } from "@mui/material";
import "../styles/loginPageStyle.css";
import { useSocket } from "../Context/SocketContext";
import { AuthGuardContext } from "../Context/AuthGuardContext";
import {
  handleDeleteNotificationApi,
  handleConfirmNotificationApi,
} from "../api/Notifications";
import { getUserByIdApi } from "../api/users";
import C_Avatar from "./C_Avatar";
import { CommentDialogContext } from "../Context/commentDialogContext";
export default function NotificationsDrawer() {
  const { open, toggleDrawer, markNewNotification } = useContext(
    NotificationsDrawerContext,
  );
  const { socket } = useSocket();
  const { currentUser, refreshUser } = useContext(AuthGuardContext);
  const [authors, setAuthors] = useState({});
  const { handleClickOpen, setPostId } = useContext(CommentDialogContext);
  async function handleConfirmNotification(userFollower) {
    try {
      await handleConfirmNotificationApi(userFollower);
      await refreshUser();
    } catch (error) {
      console.error("Confirm notification error:", error);
    }
  }

  async function handleDeleteNotification(userFollower) {
    try {
      await handleDeleteNotificationApi(userFollower);
      await refreshUser();
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  }

  useEffect(() => {
    if (!socket) return;

    function handleNotification(notification) {
      console.log("🔥 NEW NOTIFICATION:", notification);
      if (!open) markNewNotification();
      refreshUser();
    }

    socket.on("newNotification", handleNotification);
    socket.on("NewLike", handleNotification);
    socket.on("NewComment", handleNotification);
    socket.on("NewCommentLike", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
      socket.off("NewLike", handleNotification);
      socket.off("NewComment", handleNotification);
      socket.off("NewCommentLike", handleNotification);
    };
  }, [socket, refreshUser, markNewNotification, open]);

  const uniqueUserIds = useMemo(() => {
    const notificationUserIds =
      currentUser?.Notifications?.map((n) => n?.userId) || [];
    const commentUserIds = currentUser?.comments?.map((c) => c?.userId) || [];

    return [...new Set([...notificationUserIds, ...commentUserIds])].filter(
      Boolean,
    );
  }, [currentUser?.Notifications, currentUser?.comments]);

  useEffect(() => {
    async function fetchAuthors() {
      if (uniqueUserIds.length === 0) return;

      const missingIds = uniqueUserIds.filter((id) => !authors[id]);
      if (missingIds.length === 0) return;

      try {
        const results = await Promise.all(
          missingIds.map(async (id) => {
            const res = await getUserByIdApi(id);
            return { id, user: res };
          }),
        );

        setAuthors((prev) => {
          const updated = { ...prev };
          results.forEach(({ id, user }) => {
            updated[id] = user;
          });
          return updated;
        });
      } catch (error) {
        console.error("Fetch authors error:", error);
      }
    }

    fetchAuthors();
  }, [uniqueUserIds, authors]);
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
  const followNotifications = (
    <Box sx={{ width: 450 }} role="presentation">
      {currentUser?.Notifications?.map((n, index) => {
        if (n?.type !== "follow") return null;
        const author = authors[n?.userId];
        const authorProfilePic = author ? author.userProfilePic : undefined;
        const authorName = author ? author.userName : "Unknown User";
        return (
          <div
            key={n?._id || `${n?.userId}-${index}`}
            style={{ display: "flex", margin: "15px 0px 10px 10px " }}
            onClick={() => toggleDrawer(false)}
          >
            <C_Avatar
              authorName={authorName}
              authorProfilePic={authorProfilePic}
              LinkTogo={`/mainPage/${author?.userName}`}
            />
            <div style={{ marginLeft: "10px", marginTop: "5px" }}>
              <Typography
                variant="caption"
                sx={{ color: "white" }}
              >{` Follow request sent`}</Typography>{" "}
              <Typography
                variant="caption"
                className="timestamp"
                sx={{ ml: 0 }}
              >
                {n?.createdAt ? formatRelativeTime(n?.createdAt) : "Just now"}
              </Typography>
            </div>
            <Button
              variant="contained"
              sx={{
                margin: "10px 5px 0px 40px",
                width: "70px",
                height: "30px",
                fontSize: "11px",
              }}
              onClick={() => {
                handleConfirmNotification(n?.userId);
              }}
            >
              Confirm
            </Button>
            <Button
              variant="contained"
              sx={{
                margin: "10px 5px 0px 0px",
                width: "70px",
                height: "30px",
                fontSize: "11px",
                backgroundColor: "#25292e",
              }}
              onClick={() => {
                handleDeleteNotification(n?.userId);
              }}
            >
              Delete
            </Button>
          </div>
        );
      })}
    </Box>
  );
  const commentNotifications = (
    <Box sx={{ width: 450 }} role="presentation">
      {currentUser?.Notifications?.map((n, index) => {
        if (n?.type !== "comment") return null;
        const author = authors[n.userId];
        const authorProfilePic = author ? author.userProfilePic : undefined;
        const authorName = author ? author.userName : "Unknown User";
        return (
          <div
            key={n?._id || `${n?.userId}-${index}`}
            style={{
              display: "flex",
              margin: "15px 0px 10px 10px",
            }}
            onClick={() => toggleDrawer(false)}
          >
            <C_Avatar
              authorName={authorName}
              authorProfilePic={authorProfilePic}
              LinkTogo={`/mainPage/${author?.userName}`}
            />

            <div
              style={{ marginLeft: "10px", marginTop: "5px" }}
              onClick={() => {
                setPostId(n.postId);
                handleClickOpen();
              }}
            >
              <Typography variant="caption" sx={{ color: "white" }}>
                Comment on your post
              </Typography>{" "}
              <Typography
                variant="caption"
                className="timestamp"
                sx={{ ml: 0 }}
              >
                {n?.createdAt ? formatRelativeTime(n?.createdAt) : "Just now"}
              </Typography>
            </div>
          </div>
        );
      })}
    </Box>
  );
  const likeNotifications = (
    <Box sx={{ width: 450 }} role="presentation">
      {currentUser?.Notifications?.map((n, index) => {
        if (n?.type !== "like") return null;
        const author = authors[n.userId];
        const authorProfilePic = author ? author.userProfilePic : undefined;
        const authorName = author ? author.userName : "Unknown User";
        return (
          <div
            key={n?._id || `${n?.userId}-${index}`}
            style={{
              display: "flex",
              margin: "15px 0px 10px 10px",
            }}
          >
            <C_Avatar
              authorName={authorName}
              authorProfilePic={authorProfilePic}
              LinkTogo={`/mainPage/${author?.userName}`}
              onClick={() => toggleDrawer(false)}
            />

            <div
              style={{ marginLeft: "10px", marginTop: "5px" }}
              onClick={() => {
                setPostId(n.postId);
                toggleDrawer(false);
                handleClickOpen();
              }}
            >
              <Typography variant="caption" sx={{ color: "white" }}>
                liked your Post
              </Typography>{" "}
              <Typography
                variant="caption"
                className="timestamp"
                sx={{ ml: 0 }}
              >
                {n?.createdAt ? formatRelativeTime(n?.createdAt) : "Just now"}
              </Typography>
            </div>
          </div>
        );
      })}
    </Box>
  );
  return (
    <div style={{ backgroundColor: "rgb(35, 34, 34) !important" }}>
      <Drawer open={open} onClose={() => toggleDrawer(false)} disableScrollLock>
        {followNotifications}
        {commentNotifications}
        {likeNotifications}
      </Drawer>
    </div>
  );
}
