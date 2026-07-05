import { Box, List, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { MenuItem } from "../molecules";
import { Avatar, Button, Text } from "../atoms";

interface SidebarProps {
  onLogout?: () => void;
}

const sidebarStyles: Record<string, SxProps<Theme>> = {
  container: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    p: 2,
    borderRight: "1px solid",
    borderColor: "divider",
    overflowY: "auto",
    backgroundColor: "background.default",
  },
  logo: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "primary.main",
    mb: 3,
  },
  menu: {
    mb: 3,
  },
  userProfile: {
    position: "fixed",
    bottom: 20,
    left: 20,
    width: 240,
    p: 2,
    display: "flex",
    gap: 2,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 2,
    "&:hover": {
      backgroundColor: "secondary.main",
    },
  },
};

export function Sidebar(_props: SidebarProps) {
  const menuItems = [
    { label: "Home", icon: "🏠" },
    { label: "Explore", icon: "🔍" },
    { label: "Bookmarks", icon: "🔖" },
    { label: "Messages", icon: "✉️" },
    { label: "Notifications", icon: "🔔" },
    { label: "Profile", icon: "👤" },
  ];

  return (
    <Paper sx={sidebarStyles.container} elevation={0}>
      <Text sx={sidebarStyles.logo}>𝕏</Text>

      <List sx={sidebarStyles.menu}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            label={item.label}
            icon={<span style={{ fontSize: "1.5rem" }}>{item.icon}</span>}
            isActive={index === 0}
          />
        ))}
      </List>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth>
          Post
        </Button>
      </Box>

      <Box sx={sidebarStyles.userProfile}>
        <Avatar size="small" alt="User" />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Text variant="body2" sx={{ fontWeight: 600 }} truncate>
            John Doe
          </Text>
          <Text variant="caption" truncate>
            @johndoe
          </Text>
        </Box>
        <Text sx={{ fontSize: "1.5rem" }}>⋯</Text>
      </Box>
    </Paper>
  );
}
