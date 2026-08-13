import TextField from "@mui/material/TextField";
import "../styles/loginPageStyle.css";
export default function CustomTextFields({
  id,
  label,
  variant,
  type,
  required,
  onChange,
  value,
  placeholder
}) {
  return (
    <TextField
      id={id}
      label={label}
      variant={variant}
      type={type}
      required={required}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
}
