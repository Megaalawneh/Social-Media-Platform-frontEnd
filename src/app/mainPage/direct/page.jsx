"use client";

import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import PageLayout from "../../components/PageLayout";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { CreateProfileProvider } from "../../Context/CreateProfileContext";
import { AlertDialogProvider } from "../../Context/alertDialogContext";
import { AuthGuardContext } from "../../Context/AuthGuardContext";
import { useSocket } from "../../Context/SocketContext";
import {
  getConversationApi,
  getConversationsApi,
  deleteMessageApi,
  editMessageApi,
  sendMessageApi,
} from "../../api/messages";

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DirectPageContent() {
  const searchParams = useSearchParams();
  const requestedUserId = searchParams.get("userId");
  const { currentUser } = useContext(AuthGuardContext);
  const { socket } = useSocket();
  const [contacts, setContacts] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [messageMenu, setMessageMenu] = useState(null);
  const messagesEndRef = useRef(null);
  const localTypingTimeoutRef = useRef(null);
  const remoteTypingTimeoutRef = useRef(null);

  const selectedContact = contacts.find(
    (contact) => contact.user._id === activeUserId,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      setLoading(true);
      setErrorMessage("");

      try {
        const conversations = await getConversationsApi();
        if (cancelled) return;
        setContacts(conversations);

        const requestedId =
          requestedUserId && requestedUserId !== currentUser?._id
            ? requestedUserId
            : null;

        if (
          requestedId &&
          !conversations.some(({ user }) => user._id === requestedId)
        ) {
          const conversation = await getConversationApi(requestedId);
          if (cancelled) return;
          setContacts((currentContacts) => [
            { user: conversation.user, lastMessage: "", lastMessageAt: null },
            ...currentContacts,
          ]);
        }

        if (cancelled) return;
        setSendError("");
        setLoadingMessages(Boolean(requestedId || conversations.length));
        setActiveUserId(requestedId || conversations[0]?.user._id || null);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.response?.data?.message || "Could not load conversations.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadConversations();
    return () => {
      cancelled = true;
    };
  }, [requestedUserId, currentUser?._id]);

  useEffect(() => {
    if (!activeUserId) {
      return undefined;
    }

    let cancelled = false;

    async function loadMessages() {
      try {
        const conversation = await getConversationApi(activeUserId);
        if (cancelled) return;
        setMessages(conversation.messages);
        setContacts((currentContacts) => {
          const existing = currentContacts.find(
            ({ user }) => user._id === conversation.user._id,
          );
          const updatedContact = {
            ...existing,
            user: conversation.user,
          };
          return existing
            ? currentContacts.map((contact) =>
                contact.user._id === conversation.user._id
                  ? updatedContact
                  : contact,
              )
            : [updatedContact, ...currentContacts];
        });
      } catch (error) {
        if (!cancelled) {
          setMessages([]);
          setSendError(
            error.response?.data?.message || "Could not load this conversation.",
          );
        }
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    }

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [activeUserId]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleOnlineUsers = (userIds) => setOnlineUsers(userIds);
    const handlePresenceUpdate = ({ userId, online }) => {
      setOnlineUsers((currentUsers) =>
        online
          ? currentUsers.includes(userId)
            ? currentUsers
            : [...currentUsers, userId]
          : currentUsers.filter((id) => id !== userId),
      );
    };
    const handleTypingUpdate = ({ userId, isTyping }) => {
      if (userId !== activeUserId) return;
      setRemoteTyping(isTyping);
      if (remoteTypingTimeoutRef.current) {
        clearTimeout(remoteTypingTimeoutRef.current);
      }
      if (isTyping) {
        remoteTypingTimeoutRef.current = setTimeout(
          () => setRemoteTyping(false),
          3000,
        );
      }
    };
    const handleNewMessage = (message) => {
      const peer =
        message.senderId === currentUser?._id
          ? message.recipient
          : message.sender;
      if (!peer?._id) return;

      setContacts((currentContacts) => [
        {
          user: peer,
          lastMessage:
            message.type === "post" ? "Shared a post" : message.text,
          lastMessageAt: message.createdAt,
          lastMessageSenderId: message.senderId,
        },
        ...currentContacts.filter(({ user }) => user._id !== peer._id),
      ]);

      if (peer._id === activeUserId) {
        setMessages((currentMessages) =>
          currentMessages.some((current) => current._id === message._id)
            ? currentMessages
            : [...currentMessages, message],
        );
      }
    };
    const handleMessageUpdated = (message) => {
      setMessages((currentMessages) =>
        currentMessages.map((current) =>
          current._id === message._id ? { ...current, ...message } : current,
        ),
      );
      getConversationsApi()
        .then((conversations) => setContacts(conversations))
        .catch((error) =>
          console.error(
            "Could not refresh conversations after editing a message:",
            error.response?.data || error.message,
          ),
        );
    };
    const handleMessageDeleted = ({ messageId, senderId, recipientId }) => {
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message._id !== messageId),
      );
      const peerId = senderId === currentUser?._id ? recipientId : senderId;
      getConversationsApi()
        .then((conversations) => setContacts(conversations))
        .catch((error) =>
          console.error(
            "Could not refresh conversations after deleting a message:",
            error.response?.data || error.message,
          ),
        );
      if (peerId === activeUserId) setSendError("");
    };

    socket.on("presence:online-users", handleOnlineUsers);
    socket.on("presence:update", handlePresenceUpdate);
    socket.on("typing:update", handleTypingUpdate);
    socket.on("message:new", handleNewMessage);
    socket.on("message:updated", handleMessageUpdated);
    socket.on("message:deleted", handleMessageDeleted);
    socket.emit("presence:request");

    return () => {
      socket.off("presence:online-users", handleOnlineUsers);
      socket.off("presence:update", handlePresenceUpdate);
      socket.off("typing:update", handleTypingUpdate);
      socket.off("message:new", handleNewMessage);
      socket.off("message:updated", handleMessageUpdated);
      socket.off("message:deleted", handleMessageDeleted);
      if (remoteTypingTimeoutRef.current) {
        clearTimeout(remoteTypingTimeoutRef.current);
      }
    };
  }, [socket, currentUser?._id, activeUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(
    () => () => {
      if (localTypingTimeoutRef.current) {
        clearTimeout(localTypingTimeoutRef.current);
      }
      if (socket && activeUserId) {
        socket.emit("typing:update", {
          recipientId: activeUserId,
          isTyping: false,
        });
      }
    },
    [socket, activeUserId],
  );

  function handleMessageChange(event) {
    const value = event.target.value;
    setMessageText(value);
    setSendError("");

    if (!socket || !activeUserId) return;

    socket.emit("typing:update", {
      recipientId: activeUserId,
      isTyping: Boolean(value.trim()),
    });
    if (localTypingTimeoutRef.current) {
      clearTimeout(localTypingTimeoutRef.current);
    }
    if (value.trim()) {
      localTypingTimeoutRef.current = setTimeout(
        () =>
          socket.emit("typing:update", {
            recipientId: activeUserId,
            isTyping: false,
          }),
        1000,
      );
    }
  }

  async function handleSend() {
    const text = messageText.trim();
    if (!text || !activeUserId || sending) return;

    setSending(true);
    setSendError("");
    try {
      const message = await sendMessageApi(activeUserId, text);
      setMessages((currentMessages) =>
        currentMessages.some((current) => current._id === message._id)
          ? currentMessages
          : [...currentMessages, message],
      );
      setContacts((currentContacts) => {
        const existing = currentContacts.find(
          ({ user }) => user._id === activeUserId,
        );
        if (!existing) return currentContacts;
        return [
          {
            ...existing,
            lastMessage: message.text,
            lastMessageAt: message.createdAt,
            lastMessageSenderId: message.senderId,
          },
          ...currentContacts.filter(({ user }) => user._id !== activeUserId),
        ];
      });
      setMessageText("");
      setEmojiOpen(false);
      socket?.emit("typing:update", {
        recipientId: activeUserId,
        isTyping: false,
      });
    } catch (error) {
      setSendError(error.response?.data?.message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  async function handleSaveEdit(message) {
    const text = editingText.trim();
    if (message.type === "text" && !text) return;

    setSavingEdit(true);
    try {
      const updatedMessage = await editMessageApi(message._id, text);
      setMessages((currentMessages) =>
        currentMessages.map((current) =>
          current._id === updatedMessage._id
            ? { ...current, ...updatedMessage }
            : current,
        ),
      );
      setEditingMessageId(null);
      setEditingText("");
      setSendError("");
    } catch (error) {
      setSendError(
        error.response?.data?.message || "The message could not be edited.",
      );
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeleteMessage(message) {
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteMessageApi(message._id);
      setMessages((currentMessages) =>
        currentMessages.filter((current) => current._id !== message._id),
      );
      const conversations = await getConversationsApi();
      setContacts(conversations);
    } catch (error) {
      setSendError(
        error.response?.data?.message || "The message could not be deleted.",
      );
    }
  }

  const filteredContacts = contacts.filter(({ user }) =>
    `${user.userName} ${user.userFullName || ""}`
      .toLowerCase()
      .includes(searchText.trim().toLowerCase()),
  );
  const isActiveContactOnline = onlineUsers.includes(activeUserId);

  return (
    <Container
      maxWidth={false}
      className={`messageContainer${selectedContact ? " hasActiveConversation" : ""}`}
    >
      <Box className="usersSide">
        <Box className="contactTop">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {currentUser?.userName || "Messages"}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Messages
            </Typography>
          </Box>
        </Box>

        <TextField
          className="contactSearch"
          placeholder="Search conversations"
          variant="outlined"
          size="small"
          fullWidth
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8e8e8e" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Paper className="contactList" elevation={0}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : errorMessage ? (
            <Typography color="error" sx={{ p: 2 }}>
              {errorMessage}
            </Typography>
          ) : filteredContacts.length ? (
            <List disablePadding>
              {filteredContacts.map((contact) => (
                <ListItemButton
                  key={contact.user._id}
                  selected={activeUserId === contact.user._id}
                  onClick={() => {
                    if (activeUserId === contact.user._id) return;
                    setActiveUserId(contact.user._id);
                    setMessages([]);
                    setEmojiOpen(false);
                    setRemoteTyping(false);
                    setSendError("");
                    setLoadingMessages(true);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={contact.user.userName}
                      src={contact.user.userProfilePic}
                      sx={{ width: 54, height: 54 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.user.userName}
                    secondary={
                      <Box component="span">
                        {contact.lastMessage || "Tap to start a conversation"}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            display: "block",
                            color: "#8f9197",
                            marginTop: "4px",
                          }}
                        >
                          {contact.lastMessageAt
                            ? formatTime(contact.lastMessageAt)
                            : ""}
                        </Typography>
                      </Box>
                    }
                    sx={{ "& .MuiListItemText-primary": { fontWeight: 600 } }}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              {searchText
                ? "No matching conversations."
                : "No conversations yet. Open a user's profile and choose Message to start one."}
            </Typography>
          )}
        </Paper>
      </Box>

      <Box className="usersMessages">
        {selectedContact ? (
          <>
            <Box className="messageHeader">
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <IconButton
                  className="mobileConversationBack"
                  aria-label="Back to conversations"
                  onClick={() => setActiveUserId(null)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box sx={{ position: "relative" }}>
                  <Link
                    href={`/mainPage/${selectedContact.user.userName}`}
                    aria-label={`Open ${selectedContact.user.userName}'s profile`}
                    style={{ display: "block", borderRadius: "50%" }}
                  >
                    <Avatar
                      src={selectedContact.user.userProfilePic}
                      alt={selectedContact.user.userName}
                      sx={{ width: 44, height: 44 }}
                    />
                  </Link>
                  <Box
                    className={`presenceDot${isActiveContactOnline ? " online" : ""}`}
                    aria-label={isActiveContactOnline ? "Online" : "Offline"}
                  />
                </Box>
                <Box>
                  <Link
                    href={`/mainPage/${selectedContact.user.userName}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <Typography variant="h6">
                      {selectedContact.user.userName}
                    </Typography>
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    {remoteTyping
                      ? "Typing..."
                      : isActiveContactOnline
                        ? "Online"
                        : "Offline"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            <Box className="messageContent">
              {loadingMessages ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : messages.length ? (
                messages.map((message) => {
                  const outgoing = message.senderId === currentUser?._id;
                  const isEditing = editingMessageId === message._id;
                  return (
                    <Stack
                      key={message._id}
                      direction="row"
                      className={`messageRow ${outgoing ? "outgoing" : "incoming"}`}
                      spacing={1}
                    >
                      {!outgoing && (
                        <Stack
                          spacing={0.5}
                          sx={{ alignItems: "center", flexShrink: 0 }}
                        >
                          <Link
                            href={`/mainPage/${selectedContact.user.userName}`}
                            aria-label={`Open ${selectedContact.user.userName}'s profile`}
                            style={{ display: "block", borderRadius: "50%" }}
                          >
                            <Avatar
                              src={selectedContact.user.userProfilePic}
                              alt={selectedContact.user.userName}
                              sx={{ width: 24, height: 24 }}
                            />
                          </Link>
                          <Link
                            href={`/mainPage/${selectedContact.user.userName}`}
                            style={{
                              color: "inherit",
                              fontSize: "0.7rem",
                              lineHeight: 1,
                              textDecoration: "none",
                            }}
                          >
                            {selectedContact.user.userName}
                          </Link>
                        </Stack>
                      )}
                      <Box
                        className={`messageBubble ${outgoing ? "outgoing" : "incoming"}`}
                      >
                        {message.type === "post" &&
                          (message.post ? (
                            <Link
                              href={
                                message.post.author?.userName
                                  ? `/mainPage/${message.post.author.userName}`
                                  : "/mainPage"
                              }
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 230,
                                  maxWidth: "100%",
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  bgcolor: "rgba(0,0,0,0.2)",
                                }}
                              >
                                {message.post.mediaType === "video" ? (
                                  <Box
                                    component="video"
                                    src={message.post.media}
                                    controls
                                    sx={{ display: "block", width: "100%" }}
                                  />
                                ) : (
                                  <Box
                                    component="img"
                                    src={message.post.media}
                                    alt="Shared post"
                                    sx={{
                                      display: "block",
                                      width: "100%",
                                      maxHeight: 220,
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                                <Typography sx={{ p: 1, fontWeight: 600 }}>
                                  {message.post.author?.userName
                                    ? `Post by ${message.post.author.userName}`
                                    : "Shared post"}
                                </Typography>
                                {message.post.postCaption && (
                                  <Typography
                                    variant="body2"
                                    sx={{ px: 1, pb: 1 }}
                                  >
                                    {message.post.postCaption}
                                  </Typography>
                                )}
                              </Box>
                            </Link>
                          ) : (
                            <Typography variant="body2">
                              This shared post is no longer available.
                            </Typography>
                          ))}
                        {isEditing ? (
                          <Stack spacing={1} sx={{ minWidth: 200 }}>
                            <TextField
                              value={editingText}
                              onChange={(event) =>
                                setEditingText(event.target.value)
                              }
                              size="small"
                              multiline
                              slotProps={{ htmlInput: { maxLength: 4000 } }}
                              autoFocus
                            />
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                onClick={() => {
                                  setEditingMessageId(null);
                                  setEditingText("");
                                }}
                                disabled={savingEdit}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleSaveEdit(message)}
                                disabled={
                                  savingEdit ||
                                  (message.type === "text" &&
                                    !editingText.trim())
                                }
                              >
                                Save
                              </Button>
                            </Stack>
                          </Stack>
                        ) : (
                          message.text && (
                            <Typography variant="body1">
                              {message.text}
                            </Typography>
                          )
                        )}
                        <Typography variant="caption" className="timestamp">
                          {formatTime(message.createdAt)}
                        </Typography>
                        {outgoing && !isEditing && (
                          <>
                            <IconButton
                              size="small"
                              aria-label="Message actions"
                              onClick={(event) =>
                                setMessageMenu({
                                  anchorEl: event.currentTarget,
                                  message,
                                })
                              }
                              sx={{ position: "absolute", top: 2, right: 2 }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                            <Menu
                              anchorEl={messageMenu?.anchorEl}
                              open={
                                messageMenu?.message._id === message._id
                              }
                              onClose={() => setMessageMenu(null)}
                            >
                              <MenuItem
                                onClick={() => {
                                  setEditingMessageId(message._id);
                                  setEditingText(message.text || "");
                                  setMessageMenu(null);
                                }}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setMessageMenu(null);
                                  handleDeleteMessage(message);
                                }}
                              >
                                Delete
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      </Box>
                    </Stack>
                  );
                })
              ) : (
                <Typography color="text.secondary" sx={{ m: "auto" }}>
                  No messages yet. Send the first message.
                </Typography>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {sendError && (
              <Typography color="error" sx={{ px: 2 }}>
                {sendError}
              </Typography>
            )}

            <Box className="messageComposer">
              <IconButton
                color="inherit"
                onClick={() => setEmojiOpen((open) => !open)}
                aria-label="Toggle emoji picker"
              >
                <EmojiEmotionsIcon />
              </IconButton>

              <TextField
                className="composerInput"
                value={messageText}
                onChange={handleMessageChange}
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                fullWidth
                slotProps={{ htmlInput: { maxLength: 4000 } }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />

              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!messageText.trim() || sending}
                aria-label="Send message"
              >
                <SendIcon />
              </IconButton>
            </Box>

            {emojiOpen && (
              <Box className="emojiPicker">
                <EmojiPicker
                  onEmojiClick={(emojiData) =>
                    setMessageText((previous) => previous + emojiData.emoji)
                  }
                />
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              {loading
                ? "Loading conversations..."
                : "Select a conversation or open a user's profile to start one."}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default function DirectPage() {
  return (
    <CreateProfileProvider>
      <AlertDialogProvider>
        <PageLayout>
          <Suspense fallback={null}>
            <DirectPageContent />
          </Suspense>
        </PageLayout>
      </AlertDialogProvider>
    </CreateProfileProvider>
  );
}
