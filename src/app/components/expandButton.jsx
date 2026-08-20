import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Image from "next/image";
import { useState, useEffect } from "react";
export default function ExpandButton({
  name,
  icon,
  LinkTogo,
  onClick,
  authorPic,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const hasValidLink = LinkTogo && !LinkTogo.includes("undefined");

  useEffect(() => {
    function Moun() {
      setIsMounted(true);
    }
    Moun();
  }, []);
  const buttonContent = (
    <IconButton className="expandButtonIcon" onClick={onClick}>
      {icon}
      {authorPic ? (
        <div style={{ width: "24px", height: "24px", overflow: "hidden" }}>
          <Image
            src={authorPic}
            alt="profile picture"
            width={150}
            height={150}
            style={{
              width: "100%",
              height: "100%",
              border: "2px solid white",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
      ) : null}
      <span>{name}</span>
    </IconButton>
  );

  return (
    <div className="expandButton">
      {isMounted && hasValidLink ? (
        <Link href={LinkTogo}>{buttonContent}</Link>
      ) : (
        buttonContent
      )}
    </div>
  );
}
