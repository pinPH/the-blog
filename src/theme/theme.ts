import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1d9bf0",
      light: "#1a91da",
      dark: "#1a8cd8",
    },
    secondary: {
      main: "#eff3f4",
      light: "#f7f9fa",
      dark: "#e1e8ed",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f1419",
      secondary: "#536471",
    },
    divider: "#eff3f4",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      color: "#536471",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 24,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "50%",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #eff3f4",
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});
