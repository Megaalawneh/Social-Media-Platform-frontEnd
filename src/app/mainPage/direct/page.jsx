"use client";
import React, { useState } from "react";
import Container from "@mui/material/Container";
import PageLayout from "../../components/PageLayout";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  Divider,
  TextField,
  IconButton,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Badge,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import SendIcon from "@mui/icons-material/Send";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { CreateProfileProvider } from "../../Context/CreateProfileContext";
import { AlertDialogProvider } from "../../Context/alertDialogContext";
function DirectPageContent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "ZedNoult",
      avatar: "/IMG_20260804_013031_081.webp",
      status: "Online",
      lastMessage: "Let's finish the design today.",
      time: "31m",
      unread: 2,
      messages: [
        { id: 1, text: "Hi, are you there?", time: "09:14", outgoing: false },
        { id: 2, text: "Yes, I'm online now.", time: "09:16", outgoing: true },
      ],
    },
    {
      id: 2,
      name: "Amina",
      avatar: "/IMG_20260804_013031_081.webp",
      status: "Typing...",
      lastMessage: "Send the new screenshots.",
      time: "1h",
      unread: 0,
      messages: [
        {
          id: 1,
          text: "Can you send the new screenshots?",
          time: "08:30",
          outgoing: false,
        },
      ],
    },
    {
      id: 3,
      name: "Jordan",
      avatar: "/IMG_20260804_013031_081.webp",
      status: "Offline",
      lastMessage: "Okay, talk tomorrow.",
      time: "Yesterday",
      unread: 0,
      messages: [
        {
          id: 1,
          text: "Okay, talk tomorrow.",
          time: "Yesterday",
          outgoing: false,
        },
      ],
    },
  ]);

  const selectedContact = contacts[selectedIndex];

  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    const newMessage = {
      id: Date.now(),
      text: trimmed,
      time: "Now",
      outgoing: true,
    };

    setContacts((prev) =>
      prev.map((contact, index) =>
        index === selectedIndex
          ? {
              ...contact,
              messages: [...contact.messages, newMessage],
              lastMessage: trimmed,
              time: "Now",
              unread: 0,
            }
          : contact,
      ),
    );

    setMessageText("");
    setEmojiOpen(false);
  };

  const handleEmojiClick = (emojiData) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };
  return (
    <Container maxWidth="xl" className="messageContainer">
      <Box className="usersSide">
        <Box className="contactTop">
          <Typography variant="h5">Contacts</Typography>
          <IconButton color="inherit" size="small">
            <EditSquareIcon />
          </IconButton>
        </Box>

        <TextField
          className="contactSearch"
          placeholder="Search contacts"
          variant="outlined"
          size="small"
          fullWidth
        />

        <Paper className="contactList" elevation={0}>
          <List disablePadding>
            {contacts.map((contact, index) => (
              <ListItemButton
                key={contact.id}
                selected={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    badgeContent={contact.unread || null}
                    color="primary"
                  >
                    <Avatar alt={contact.name} src={contact.avatar} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={contact.name}
                  secondary={
                    <Box component="span">
                      {contact.lastMessage}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#8f9197",
                          marginTop: "4px",
                        }}
                      >
                        {contact.time}
                      </Typography>
                    </Box>
                  }
                  sx={{ "& .MuiListItemText-primary": { fontWeight: 600 } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Box>

      <Box className="usersMessages">
        <Box className="messageHeader">
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar
              src={selectedContact.avatar}
              sx={{ width: 52, height: 52 }}
            />
            <Box>
              <Typography variant="h6">{selectedContact.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedContact.status}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton color="inherit">
              <EditSquareIcon />
            </IconButton>
          </Stack>
        </Box>

        <Divider />

        <Box className="messageContent">
          {selectedContact.messages.map((message) => (
            <Box
              key={message.id}
              className={`messageBubble ${message.outgoing ? "outgoing" : "incoming"}`}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Typography variant="caption" className="timestamp">
                {message.time}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box className="messageComposer">
          <IconButton
            color="inherit"
            onClick={() => setEmojiOpen((open) => !open)}
          >
            <EmojiEmotionsIcon />
          </IconButton>

          <TextField
            className="composerInput"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Type a message..."
            variant="outlined"
            size="small"
            fullWidth
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            onClick={() => setEmojiOpen(!open)}
          />

          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>

        {emojiOpen && (
          <Box className="emojiPicker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
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
           <DirectPageContent />
            </PageLayout>
          </AlertDialogProvider>
        </CreateProfileProvider>
  );
}
