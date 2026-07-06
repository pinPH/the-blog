import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

interface MenuItemProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function MenuItem({ icon, label, onClick, isActive }: MenuItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        sx={{
          borderRadius: 2,
          mb: 1,
          color: isActive ? "primary.main" : "text.primary",
          fontWeight: isActive ? 600 : 500,
          "&:hover": {
            backgroundColor: "secondary.main",
          },
        }}
      >
        {icon && (
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            {icon}
          </ListItemIcon>
        )}
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}
