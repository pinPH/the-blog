import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Sidebar } from "../organisms/Sidebar";
import { Navbar } from "../organisms/Navbar";

interface HomeTemplateProps {
  children: React.ReactNode;
}

const homeTemplateStyles: Record<string, SxProps<Theme>> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "background.default",
  },
  sidebar: {
    display: {
      xs: "none",
      md: "block",
    },
  },
  main: {
    flex: 1,
    ml: {
      xs: 0,
      md: "280px",
    },
    mr: {
      xs: 0,
      md: "320px",
    },
    mt: 8,
  },
  rightSidebar: {
    display: {
      xs: "none",
      lg: "block",
    },
    position: "fixed",
    right: 0,
    top: 80,
    width: 320,
    p: 2,
    overflowY: "auto",
  },
};

export function HomeTemplate({ children }: HomeTemplateProps) {
  return (
    <Box sx={homeTemplateStyles.root}>
      <Box sx={homeTemplateStyles.sidebar}>
        <Sidebar />
      </Box>

      <Navbar />

      <Box sx={homeTemplateStyles.main}>{children}</Box>

      <Box sx={homeTemplateStyles.rightSidebar}>
        {/* Right sidebar content will go here */}
      </Box>
    </Box>
  );
}
