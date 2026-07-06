import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  IconButton,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useState } from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Text } from "../atoms";
import { TextInput } from "../molecules";
import { useAuth } from "../../hooks";

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
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    pt: 1,
    minWidth: {
      xs: "100%",
      sm: 360,
    },
  },
  errorText: {
    color: "error.main",
    fontSize: "0.875rem",
  },
};

export function Navbar({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const { user, isAuthenticated, isAuthLoading, login, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const openLoginModal = () => {
    setLoginError(null);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    if (isAuthLoading) {
      return;
    }

    setIsLoginModalOpen(false);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setLoginError("Enter username and password.");
      return;
    }

    setLoginError(null);

    try {
      await login(username, password);
      toast.success("Logged in successfully.");
      setIsLoginModalOpen(false);
      setUsername("");
      setPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not log in.");
      setLoginError(
        error instanceof Error ? error.message : "Could not log in.",
      );
    }
  };

  const handleAuthButton = () => {
    if (isAuthenticated) {
      logout();
      toast.info("Session ended.");
      setLoginError(null);
      setUsername("");
      setPassword("");
      return;
    }

    openLoginModal();
  };

  return (
    <Paper sx={navbarStyles.container} elevation={0}>
      <Box sx={navbarStyles.content}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={onMenuOpen}
            sx={{ display: { xs: "flex", notebook: "none" } }}
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </IconButton>
          <Text sx={navbarStyles.logo}>𝕏</Text>
        </Box>
        <Box sx={navbarStyles.actions}>
          {isAuthenticated ? (
            <RouterLink to="/profile" style={{ textDecoration: "none" }}>
              <Button variant="text">Profile</Button>
            </RouterLink>
          ) : null}
          <Button variant="outlined" onClick={handleAuthButton}>
            {isAuthenticated ? "Log out" : "Log in"}
          </Button>
        </Box>
      </Box>

      <Dialog
        open={isLoginModalOpen}
        onClose={closeLoginModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isAuthenticated ? `Hello, ${user?.name}` : "Log in"}
        </DialogTitle>
        <DialogContent>
          {isAuthLoading ? (
            <Box sx={navbarStyles.modalForm}>
              <Skeleton variant="rounded" height={56} />
              <Skeleton variant="rounded" height={56} />
              <Skeleton variant="text" height={24} width="60%" />
            </Box>
          ) : (
            <Box sx={navbarStyles.modalForm}>
              <TextInput
                label="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                fullWidth
              />
              <TextInput
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
              />
              {loginError ? (
                <Text sx={navbarStyles.errorText}>{loginError}</Text>
              ) : null}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={closeLoginModal}
            disabled={isAuthLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={isAuthLoading}
          >
            Sign in
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
