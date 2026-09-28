import { Avatar, Typography, Stack } from "@mui/material";
import Link from "next/link";

export default function C_Avatar({ authorName, authorProfilePic, LinkTogo,onClick }) {
  const hasValidLink = Boolean(LinkTogo && !LinkTogo.includes("undefined"));

  const content = (
    <Stack direction="row" spacing={1.5} >
      <Avatar
        alt={authorName}
        src={authorProfilePic}
        sx={{ width: 40, height: 40, border: "2px solid #2c2f36" }}
        
      />
      <Typography
        component="span"
        variant="caption"
        sx={{
          color: "#b5bac3",
          fontSize: "0.95rem",
          marginTop: "5px !important",
        }}
      >
        {authorName}
      </Typography>
    </Stack>
  );

  if (hasValidLink) {
    return (
      <Link href={LinkTogo} style={{ textDecoration: "none" }} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return content;
}
