import { Box, Drawer, IconButton, List, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import {
  HomeOutlined,
  Search,
  BookmarkBorder,
  MailOutline,
  NotificationsNone,
  PersonOutline,
  Close,
} from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { MenuItem } from "../molecules";
import { Avatar, Text } from "../atoms";
import { useAuth } from "../../hooks";

const DRAWER_WIDTH = 280;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const sidebarStyles: Record<string, SxProps<Theme>> = {
  desktopPaper: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: 240,
    p: 2,
    borderRight: "1px solid",
    borderColor: "divider",
    overflowY: "auto",
    backgroundColor: "background.default",
    display: { xs: "none", notebook: "block" },
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
  desktopUserProfile: {
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
  mobileUserProfile: {
    mt: "auto",
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

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: "Home", icon: <HomeOutlined />, to: "/" },
    { label: "Explore", icon: <Search /> },
  ];

  if (isAuthenticated) {
    menuItems.push(
      {
        label: "Bookmarks",
        icon: <BookmarkBorder />,
      },
      {
        label: "Messages",
        icon: <MailOutline />,
        to: "/messages",
      },
      {
        label: "Notifications",
        icon: <NotificationsNone />,
      },
      {
        label: "Profile",
        icon: <PersonOutline />,
        to: "/profile",
      },
    );
  }

  const userTag = user?.email ? `@${user.email.split("@")[0]}` : "@guest";

  const renderMenuList = () => (
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
              icon={item.icon}
              isActive={location.pathname === item.to}
            />
          </RouterLink>
        ) : (
          <Box key={index}>
            <MenuItem label={item.label} icon={item.icon} isActive={false} />
          </Box>
        ),
      )}
    </List>
  );

  const renderUserProfileContent = () => (
    <>
      <Avatar size="small" alt="User" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Text variant="body2" sx={{ fontWeight: 600 }} truncate>
          {user?.name || "Guest"}
        </Text>
        <Text variant="caption" truncate>
          {userTag}
        </Text>
      </Box>
    </>
  );

  const drawerContent = (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Text sx={{ ...sidebarStyles.logo, mb: 0 }}>𝕏</Text>
        <IconButton
          onClick={onMobileClose}
          size="small"
          aria-label="Fechar menu"
        >
          <Close />
        </IconButton>
      </Box>
      {renderMenuList()}
      {isAuthenticated ? (
        <Box sx={sidebarStyles.mobileUserProfile}>
          {renderUserProfileContent()}
        </Box>
      ) : null}
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", notebook: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Paper elevation={0} sx={sidebarStyles.desktopPaper}>
        <Text sx={sidebarStyles.logo}>𝕏</Text>
        {renderMenuList()}
        {isAuthenticated ? (
          <Box sx={sidebarStyles.desktopUserProfile}>
            {renderUserProfileContent()}
          </Box>
        ) : null}
      </Paper>
    </>
  );
}
