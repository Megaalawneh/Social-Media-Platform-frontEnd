
import Button from "@mui/material/Button";
export default function myButton({ name, variant, className, startIcon, type, onClick ,disabled}) {
  return (
    <Button
      variant={variant}
      className={className}
      startIcon={startIcon}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </Button>
  );
}
