import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Text } from "../atoms";
import { TextInput } from "../molecules";
import { useAuth } from "../../hooks";

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

export function Navbar({ onNewPost }: NavbarProps) {
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
      setLoginError("Informe usuario e senha.");
      return;
    }

    setLoginError(null);

    try {
      await login(username, password);
      toast.success("Login realizado com sucesso.");
      setIsLoginModalOpen(false);
      setUsername("");
      setPassword("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Nao foi possivel logar.",
      );
      setLoginError(
        error instanceof Error ? error.message : "Nao foi possivel logar.",
      );
    }
  };

  const handleAuthButton = () => {
    if (isAuthenticated) {
      logout();
      toast.info("Sessao encerrada.");
      setLoginError(null);
      setUsername("");
      setPassword("");
      return;
    }

    openLoginModal();
  };

  const handleNewPostClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    onNewPost?.();
  };

  return (
    <Paper sx={navbarStyles.container} elevation={0}>
      <Box sx={navbarStyles.content}>
        <Text sx={navbarStyles.logo}>𝕏</Text>
        <Box sx={navbarStyles.actions}>
          {isAuthenticated ? (
            <RouterLink to="/dashboard" style={{ textDecoration: "none" }}>
              <Button variant="text">Dashboard</Button>
            </RouterLink>
          ) : null}
          <Button variant="outlined" onClick={handleAuthButton}>
            {isAuthenticated ? "Sair" : "Login"}
          </Button>
          <Button variant="contained" onClick={handleNewPostClick}>
            New Post
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
          {isAuthenticated ? `Ola, ${user?.name}` : "Fazer login"}
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
                label="Usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                fullWidth
              />
              <TextInput
                label="Senha"
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
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={isAuthLoading}
          >
            Entrar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
