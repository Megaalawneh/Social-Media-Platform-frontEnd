import { CardMedia } from "@mui/material";
import "../styles/AccountPageStyle.css";
import { CommentDialogContext } from "../Context/commentDialogContext";
import { useContext, useRef, useState } from "react";
import { Typography, Box } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import IconButton from "@mui/material/IconButton";
export default function PicPost({ img, id, mediaType, p }) {
  const { handleClickOpen, setPostId } = useContext(CommentDialogContext);
  const videoRef = useRef(null);
  const Isvideo = mediaType === "video";
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

  return (
    <>
      {Isvideo ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "9 / 16",
            maxHeight: 380,
            overflow: "hidden",
            bgcolor: "#000",
          }}
          className="postvideo"
          onClick={() => {
            handleClickOpen();
            setPostId(id);
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
        <div className="postPic">
          <CardMedia
            component="img"
            onClick={() => {
              handleClickOpen();
              setPostId(id);
            }}
            sx={{
              width: "100%",
              height: 380,
              maxHeight: 380,
              objectFit: "cover",
            }}
            image={img || "https://via.placeholder.com/470x300"}
            alt="post Share"
          />
        </div>
      )}
    </>
  );
}
