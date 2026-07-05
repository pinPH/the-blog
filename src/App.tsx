import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "./theme/theme";
import { AppRouter } from "./routes/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={3000} newestOnTop />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
