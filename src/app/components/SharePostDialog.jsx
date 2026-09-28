"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { getFollowingUsersApi } from "../api/users";
import { sharePostInMessagesApi } from "../api/messages";

export default function SharePostDialog({ open, post, onClose, onShared }) {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleClose() {
    setLoading(true);
    setUsers([]);
    setSelectedUserIds([]);
    setErrorMessage("");
    onClose();
  }

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;
    async function loadFollowing() {
      try {
        const followingUsers = await getFollowingUsersApi();
        if (!cancelled) {
          setUsers(followingUsers);
          setSelectedUserIds([]);
          setErrorMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.response?.data?.message || "Could not load followed users.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFollowing();
    return () => {
      cancelled = true;
    };
  }, [open]);

  function toggleRecipient(userId) {
    setSelectedUserIds((currentIds) =>
      currentIds.includes(userId)
        ? currentIds.filter((id) => id !== userId)
        : [...currentIds, userId],
    );
  }

  async function handleSend() {
    if (!selectedUserIds.length || sending) return;

    setSending(true);
    setErrorMessage("");
    try {
      const result = await sharePostInMessagesApi(post._id, selectedUserIds);
      onShared?.(result.post);
      handleClose();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "The post could not be shared.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={sending ? undefined : handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Share post</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress size={24} />
        ) : users.length ? (
          <List disablePadding>
            {users.map((user) => (
              <ListItem key={user._id} disablePadding>
                <ListItemButton onClick={() => toggleRecipient(user._id)}>
                    <Checkbox
                      checked={selectedUserIds.includes(user._id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  <ListItemAvatar>
                    <Avatar src={user.userProfilePic} alt={user.userName} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.userName}
                    secondary={user.userFullName}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">
            Follow users first to share posts with them.
          </Typography>
        )}
        {errorMessage && (
          <Typography color="error" role="alert" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={sending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || sending || selectedUserIds.length === 0}
        >
          {sending ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
