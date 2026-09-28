"use client";
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { styled } from "@mui/material/styles";
import { AuthGuardContext } from "../Context/AuthGuardContext";
import { handleSharePostApi } from "../api/posts";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function SimpleDialog({ onClose, selectedValue, open }) {
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { currentUser, refreshPosts } = useContext(AuthGuardContext);

  const getUploadErrorMessage = (error) => {
    const responseData = error?.response?.data;
    const serverMessage =
      typeof responseData === "string"
        ? responseData
        : responseData?.message || responseData?.error?.message;

    if (serverMessage) return serverMessage;
    if (error?.response?.status) {
      return `Upload failed with server status ${error.response.status}. Please try again.`;
    }
    if (error?.request) {
      return "Could not reach the server. Check that the backend is running and try again.";
    }

    return error?.message || "Failed to upload post. Please try again.";
  };

  const discardMedia = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(null);
    setPreviewUrl("");
    setMediaType("");
    setUploadError("");
  };

  const handleClose = () => {
    discardMedia();
    setCaption("");
    onClose(selectedValue);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setUploadError("Please choose an image or video file.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMediaType(file.type.startsWith("video/") ? "video" : "image");
    setUploadError("");
  };

  const handleShare = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("media", selectedFile);
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);

      await handleSharePostApi(formData);

      discardMedia();
      setCaption("");
      onClose(selectedValue);

      if (refreshPosts) refreshPosts();
    } catch (error) {
      const message = getUploadErrorMessage(error);
      console.error(
        `Upload error (${error?.response?.status || error?.code || "unknown"}): ${message}`,
      );
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      disableScrollLock
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Create new post</span>
        <IconButton onClick={handleClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!previewUrl ? (
          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <PermMediaIcon sx={{ fontSize: 52, color: "text.secondary" }} />
            <Typography variant="h6">Choose a photo or video</Typography>

            <Button
              component="label"
              variant="contained"
              startIcon={<PermMediaIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov"
                onChange={handleFileChange}
              />
            </Button>

            {uploadError && (
              <Typography color="error" variant="body2">
                {uploadError}
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {mediaType === "video" ? (
              <Box
                component="video"
                src={previewUrl}
                controls
                playsInline
                preload="metadata"
                sx={{
                  width: "100%",
                  maxHeight: 420,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            ) : (
              <Box
                component="img"
                src={previewUrl}
                alt="Selected upload preview"
                sx={{
                  width: "100%",
                  maxHeight: 420,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            )}

            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Write a caption..."
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
        {previewUrl ? (
          <Button color="inherit" onClick={discardMedia} disabled={isUploading}>
            Choose another file
          </Button>
        ) : (
          <Box />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleShare}
          disabled={!selectedFile || !currentUser?._id || isUploading}
        >
          {isUploading ? "Uploading..." : "Share"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string,
};

export default function SimpleDialogDemo({
  me = false,
  open: controlledOpen,
  onClose,
}) {
  const [internalOpen, setInternalOpen] = useState(Boolean(me));
  const open = controlledOpen ?? internalOpen;

  const handleClose = () => {
    onClose?.();
    setInternalOpen(false);
  };

  return <SimpleDialog open={Boolean(open)} onClose={handleClose} />;
}
