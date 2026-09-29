import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import { useContext, useEffect, useState, useMemo } from "react";
import { NotificationsDrawerContext } from "../Context/NotificationsDrawerContext";
import { Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
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
  const { open, anchorEl, toggleDrawer, markNewNotification } = useContext(NotificationsDrawerContext);
  const { socket } = useSocket();
  const { currentUser, refreshUser } = useContext(AuthGuardContext);
  const [authors, setAuthors] = useState({});
  const { handleClickOpen, setPostId } = useContext(CommentDialogContext);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") toggleDrawer(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, toggleDrawer]);
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
  const notifications = useMemo(
    () =>
      (currentUser?.Notifications || []).filter((notification) =>
        ["follow", "comment", "like"].includes(notification?.type),
      ),
    [currentUser?.Notifications],
  );

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
  function getNotificationDescription(type) {
    if (type === "follow") return "requested to follow you";
    if (type === "comment") return "commented on your post";
    return "liked your post";
  }

  return (
    <ClickAwayListener onClickAway={() => open && toggleDrawer(false)}>
      <Popper
        className="notificationsPopoverRoot"
        open={open && Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="right-start"
        modifiers={[
          { name: "flip", options: { padding: 12 } },
          { name: "preventOverflow", options: { padding: 12 } },
        ]}
      >
        <Box
          className="notificationsPopoverPaper"
          role="dialog"
          aria-labelledby="notifications-title"
        >
          <Box className="notificationsPanel">
            <Box className="notificationsHeader">
              <Typography id="notifications-title" variant="h6">
                Notifications
              </Typography>
              <IconButton
                aria-label="Close notifications"
                onClick={() => toggleDrawer(false)}
                className="notificationsCloseButton"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {notifications.length === 0 ? (
              <Box className="notificationsEmptyState">
                <NotificationsNoneIcon aria-hidden="true" />
                <Typography variant="subtitle1">
                  No notifications yet
                </Typography>
                <Typography variant="body2">
                  When someone interacts with you, you&apos;ll see it here.
                </Typography>
              </Box>
            ) : (
              <Box className="notificationsList" role="list">
                {notifications.map((notification, index) => {
                  const author = authors[notification.userId];
                  const authorName = author?.userName || "Unknown User";
                  const description = getNotificationDescription(
                    notification.type,
                  );
                  const isFollowRequest = notification.type === "follow";

                  return (
                    <Box
                      className="notificationItem"
                      key={
                        notification?._id ||
                        `${notification?.userId}-${index}`
                      }
                      role="listitem"
                    >
                      <C_Avatar
                        authorName={authorName}
                        authorProfilePic={author?.userProfilePic}
                        LinkTogo={
                          author?.userName
                            ? `/mainPage/${author.userName}`
                            : undefined
                        }
                        onClick={() => toggleDrawer(false)}
                      />
                      <Box
                        className="notificationMessage"
                        onClick={() => {
                          if (
                            notification.type === "comment" ||
                            notification.type === "like"
                          ) {
                            setPostId(notification.postId);
                            toggleDrawer(false);
                            handleClickOpen();
                          }
                        }}
                      >
                        <Typography variant="body2">
                          <strong>{authorName}</strong> {description}
                        </Typography>
                        <Typography variant="caption" className="timestamp">
                          {notification?.createdAt
                            ? formatRelativeTime(notification.createdAt)
                            : "Just now"}
                        </Typography>
                      </Box>
                      {isFollowRequest && (
                        <Box className="notificationActions">
                          <Button
                            variant="contained"
                            onClick={() =>
                              handleConfirmNotification(notification.userId)
                            }
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() =>
                              handleDeleteNotification(notification.userId)
                            }
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>
      </Popper>
    </ClickAwayListener>
  );
}
