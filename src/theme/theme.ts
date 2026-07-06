import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    notebook: true;
  }
}

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      notebook: 1280,
      xl: 1536,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#1d9bf0",
      light: "#1a91da",
      dark: "#1a8cd8",
    },
    secondary: {
      main: "#94a3b8",
      light: "#cbd5e1",
      dark: "#64748b",
    },
    background: {
      default: "#0f1115",
      paper: "#171a21",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
    divider: "#2a3140",
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
      fontSize: "16px",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "12px",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      color: "#94a3b8",
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
          border: "1px solid #2a3140",
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});
