import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Button, Text } from "../atoms";

export function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Text variant="h3" sx={{ fontWeight: 700 }}>
        Page not found
      </Text>
      <RouterLink to="/" style={{ textDecoration: "none" }}>
        <Button variant="contained">Back to home</Button>
      </RouterLink>
    </Box>
  );
}
