import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useState } from "react";
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
  main: {
    flex: 1,
    mt: 10,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={homeTemplateStyles.root}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Navbar onMenuOpen={() => setMobileOpen(true)} />

      <Box sx={homeTemplateStyles.main}>{children}</Box>

      {rightSidebar ? (
        <Box sx={homeTemplateStyles.rightSidebar}>{rightSidebar}</Box>
      ) : null}
    </Box>
  );
}
