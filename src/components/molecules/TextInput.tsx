import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface TextInputProps extends Omit<TextFieldProps, "variant"> {
  fullWidth?: boolean;
}

const inputStyles: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
    "&:hover": {
      borderColor: "primary.main",
      borderWidth: 2,
    },
    "&.Mui-focused": {
      borderColor: "primary.main",
      borderWidth: 2,
    },
  },
};

export function TextInput({ ...props }: TextInputProps) {
  return <TextField sx={inputStyles} {...props} />;
}
