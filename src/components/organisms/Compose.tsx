import { useState } from "react";
import { Box, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Avatar, Button } from "../atoms";

interface ComposeProps {
  onSubmit?: (content: string) => void;
}

const composeStyles: Record<string, SxProps<Theme> | React.CSSProperties> = {
  container: {
    p: 2,
    borderBottom: "1px solid",
    borderColor: "divider",
    mb: 2,
  },
  content: {
    display: "flex",
    gap: 2,
  },
  inputArea: {
    flex: 1,
  },
  textarea: {
    width: "100%",
    fontSize: "16px",
    fontFamily: "inherit",
    border: "none",
    outline: "none",
    resize: "none",
    minHeight: "50px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1,
    mt: 2,
    pt: 2,
    borderTop: "1px solid",
    borderColor: "divider",
  },
};

export function Compose({ onSubmit }: ComposeProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit?.(content);
      setContent("");
    }
  };

  return (
    <Paper sx={composeStyles.container} elevation={0}>
      <Box sx={composeStyles.content}>
        <Avatar size="small" />
        <Box sx={composeStyles.inputArea}>
          <textarea
            placeholder="What is happening?!"
            style={composeStyles.textarea as React.CSSProperties}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Box sx={composeStyles.actions}>
            <Button
              variant="contained"
              disabled={!content.trim()}
              onClick={handleSubmit}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
