import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface TextProps extends TypographyProps {
  truncate?: boolean;
  secondary?: boolean;
}

export function Text({ truncate, secondary, sx, ...props }: TextProps) {
  const baseStyles: SxProps<Theme> = {
    overflow: truncate ? "hidden" : "visible",
    textOverflow: truncate ? "ellipsis" : "clip",
    whiteSpace: truncate ? "nowrap" : "normal",
    color: secondary ? "text.secondary" : "text.primary",
  };

  return (
    <Typography
      sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  );
}
