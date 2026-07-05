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
import { Button, Text } from "../atoms";
import { TextInput } from "../molecules";

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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [loginText, setLoginText] = useState("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const openLoginModal = () => {
    setLoginError(null);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    if (isLoadingLogin) {
      return;
    }

    setIsLoginModalOpen(false);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setLoginError("Informe usuario e senha.");
      return;
    }

    setIsLoadingLogin(true);
    setLoginError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(errorData?.message || "Login failed");
      }

      const data = (await response.json()) as { user?: { name?: string } };
      const name = data.user?.name || "User";
      setLoginText(`Ola, ${name}`);
      setIsLoginModalOpen(false);
      setUsername("");
      setPassword("");
    } catch (error) {
      setLoginText("Login");
      setLoginError(
        error instanceof Error ? error.message : "Nao foi possivel logar.",
      );
    } finally {
      setIsLoadingLogin(false);
    }
  };

  return (
    <Paper sx={navbarStyles.container} elevation={0}>
      <Box sx={navbarStyles.content}>
        <Text sx={navbarStyles.logo}>𝕏</Text>
        <Box sx={navbarStyles.actions}>
          <Button variant="outlined" onClick={openLoginModal}>
            {loginText}
          </Button>
          <Button variant="contained" onClick={onNewPost}>
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
        <DialogTitle>Fazer login</DialogTitle>
        <DialogContent>
          {isLoadingLogin ? (
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
            disabled={isLoadingLogin}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={isLoadingLogin}
          >
            Entrar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
