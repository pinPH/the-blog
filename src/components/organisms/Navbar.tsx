import { Box, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Button, Text } from "../atoms";

interface NavbarProps {
  onNewPost?: () => void;
}

const navbarStyles: Record<string, SxProps<Theme>> = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid",
    borderColor: "divider",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
    py: 1,
    maxWidth: "100%",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "primary.main",
  },
};

export function Navbar({ onNewPost }: NavbarProps) {
  return (
    <Paper sx={navbarStyles.container} elevation={0}>
      <Box sx={navbarStyles.content}>
        <Text sx={navbarStyles.logo}>𝕏</Text>
        <Button variant="contained" onClick={onNewPost}>
          New Post
        </Button>
      </Box>
    </Paper>
  );
}
