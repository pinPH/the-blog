import { Box, List, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { MenuItem } from "../molecules";
import { Avatar, Button, Text } from "../atoms";
import { useAuth } from "../../hooks";

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
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: "Home", icon: "🏠", to: "/" },
    { label: "Explore", icon: "🔍" },
  ];

  if (isAuthenticated) {
    menuItems.push(
      {
        label: "Bookmarks",
        icon: "🔖",
      },
      {
        label: "Messages",
        icon: "✉️",
        to: "/messages",
      },
      {
        label: "Notifications",
        icon: "🔔",
      },
      {
        label: "Profile",
        icon: "👤",
      },
      {
        label: "Dashboard",
        icon: "🛡️",
        to: "/dashboard",
      },
    );
  }

  const handleLogout = () => {
    logout();
  };

  const userTag = user?.email ? `@${user.email.split("@")[0]}` : "@guest";

  return (
    <Paper sx={sidebarStyles.container} elevation={0}>
      <Text sx={sidebarStyles.logo}>𝕏</Text>

      <List sx={sidebarStyles.menu}>
        {menuItems.map((item, index) =>
          item.to ? (
            <RouterLink
              key={index}
              to={item.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem
                label={item.label}
                icon={<span style={{ fontSize: "1.5rem" }}>{item.icon}</span>}
                isActive={location.pathname === item.to}
              />
            </RouterLink>
          ) : (
            <Box key={index}>
              <MenuItem
                label={item.label}
                icon={<span style={{ fontSize: "1.5rem" }}>{item.icon}</span>}
                isActive={false}
              />
            </Box>
          ),
        )}
      </List>

      {isAuthenticated ? (
        <Box sx={sidebarStyles.userProfile}>
          <Avatar size="small" alt="User" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Text variant="body2" sx={{ fontWeight: 600 }} truncate>
              {user?.name || "Guest"}
            </Text>
            <Text variant="caption" truncate>
              {userTag}
            </Text>
          </Box>
          <Button
            variant="text"
            onClick={handleLogout}
            sx={{ minWidth: "auto", px: 1.5 }}
          >
            Sair
          </Button>
        </Box>
      ) : null}
    </Paper>
  );
}
