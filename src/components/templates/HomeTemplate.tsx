import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Sidebar } from "../organisms/Sidebar";
import { Navbar } from "../organisms/Navbar";

interface HomeTemplateProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
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
    mx: 10,
    mt: 10,
    mr: {
      lg: 44,
    },
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

export function HomeTemplate({ children, rightSidebar }: HomeTemplateProps) {
  return (
    <Box sx={homeTemplateStyles.root}>
      <Box sx={homeTemplateStyles.sidebar}>
        <Sidebar />
      </Box>

      <Navbar />

      <Box sx={homeTemplateStyles.main}>{children}</Box>

      {rightSidebar ? (
        <Box sx={homeTemplateStyles.rightSidebar}>{rightSidebar}</Box>
      ) : null}
    </Box>
  );
}
