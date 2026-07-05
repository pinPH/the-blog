import { Button as MuiButton } from "@mui/material";
import type {
  ButtonProps as MuiButtonProps,
  SxProps,
  Theme,
} from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  isLoading?: boolean;
}

const buttonStyles: Record<string, SxProps<Theme>> = {
  contained: {
    backgroundColor: "primary.main",
    color: "white",
    fontWeight: 600,
    fontSize: "1rem",
    py: 1,
    px: 3,
    "&:hover": {
      backgroundColor: "primary.dark",
    },
  },
  outlined: {
    borderColor: "divider",
    color: "primary.main",
    fontWeight: 600,
    fontSize: "1rem",
    py: 1.5,
    px: 4,
  },
  text: {
    color: "primary.main",
    fontWeight: 600,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "primary.light",
      opacity: 0.1,
    },
  },
};

export function Button({
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      disabled={disabled || isLoading}
      sx={buttonStyles[props.variant || "contained"]}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
