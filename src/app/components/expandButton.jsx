import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

export default function expandButton({ name, icon, LinkTogo, onClick }) {
  const buttonContent = (
    <IconButton className="expandButtonIcon" onClick={onClick}>
      {icon}
      <span>{name}</span>
    </IconButton>
  );

  return (
    <div className="expandButton">
      {LinkTogo ? <Link href={LinkTogo}>{buttonContent}</Link> : buttonContent}
    </div>
  );
}
