"use client";
import { createTheme } from "@mui/material/styles";
const theme = createTheme({
 components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          display: "none",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#232222",
          color: "#fff",
          borderRadius: 8,
          marginTop: 10,
          marginBottom: 10,

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#666",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
            borderWidth: 2,
          },
        },

        input: {
          color: "#fff",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#bbb",
          textDecoration: "none",

          "&.Mui-focused": {
            color: "#666",
          },
        },
      },
    },
  },
});

export default theme;
