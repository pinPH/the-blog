import { Chip } from "@mui/material";
import type { ChipProps, SxProps, Theme } from "@mui/material";

interface BadgeProps extends Omit<ChipProps, "variant"> {
  variant?: "primary" | "secondary" | "error";
}

const badgeStyles: Record<string, SxProps<Theme>> = {
  primary: {
    backgroundColor: "primary.main",
    color: "white",
    fontWeight: 600,
    fontSize: "0.75rem",
  },
  secondary: {
    backgroundColor: "secondary.main",
    color: "text.primary",
    fontWeight: 600,
    fontSize: "0.75rem",
  },
  error: {
    backgroundColor: "#e74c3c",
    color: "white",
    fontWeight: 600,
    fontSize: "0.75rem",
  },
};

export function Badge({ variant = "primary", ...props }: BadgeProps) {
  return <Chip size="small" sx={badgeStyles[variant]} {...props} />;
}
