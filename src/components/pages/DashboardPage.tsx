import { Box, Paper } from "@mui/material";
import { HomeTemplate } from "../templates";
import { Text } from "../atoms";
import { useAuth } from "../../hooks";

export function DashboardPage() {
  const { user, token } = useAuth();

  return (
    <HomeTemplate>
      <Box sx={{ p: 2 }}>
        <Text variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Dashboard privada
        </Text>
        <Text sx={{ mb: 2 }}>
          Essa rota e protegida e usa os dados do contexto global de
          autenticacao.
        </Text>

        <Paper sx={{ p: 2, borderRadius: 2 }} elevation={0}>
          <Text sx={{ fontWeight: 600, mb: 1 }}>Usuario autenticado</Text>
          <Text>Nome: {user?.name}</Text>
          <Text>Email: {user?.email}</Text>

          <Text sx={{ fontWeight: 600, mt: 2, mb: 1 }}>JWT atual</Text>
          <Text sx={{ wordBreak: "break-all" }}>{token}</Text>
        </Paper>
      </Box>
    </HomeTemplate>
  );
}
