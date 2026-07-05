import { Avatar as MuiAvatar } from "@mui/material";
import type { AvatarProps as MuiAvatarProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface AvatarProps extends MuiAvatarProps {
  size?: "small" | "medium" | "large";
}

const avatarSizes: Record<string, SxProps<Theme>> = {
  small: {
    width: 32,
    height: 32,
    fontSize: "0.75rem",
  },
  medium: {
    width: 48,
    height: 48,
    fontSize: "1rem",
  },
  large: {
    width: 128,
    height: 128,
    fontSize: "2rem",
  },
};

export function Avatar({ size = "medium", ...props }: AvatarProps) {
  return <MuiAvatar sx={avatarSizes[size]} {...props} />;
}
