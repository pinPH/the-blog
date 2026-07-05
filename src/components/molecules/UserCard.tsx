import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Avatar, Text } from "../atoms";
import type { User } from "../../types";

interface UserCardProps {
  user: User;
  onClick?: () => void;
}

const userCardStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: "flex",
    gap: 2,
    p: 2,
    borderRadius: 2,
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "secondary.main",
    },
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  name: {
    fontWeight: 700,
  },
  handle: {
    color: "text.secondary",
  },
};

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Box sx={userCardStyles.container} onClick={onClick}>
      <Avatar size="medium" src={user.avatar} alt={user.name} />
      <Box sx={userCardStyles.content}>
        <Box sx={userCardStyles.header}>
          <Text sx={userCardStyles.name}>{user.name}</Text>
          {user.verified && <Text>✓</Text>}
        </Box>
        <Text sx={userCardStyles.handle}>@{user.handle}</Text>
        {user.bio && (
          <Text variant="body2" sx={{ mt: 1 }}>
            {user.bio}
          </Text>
        )}
      </Box>
    </Box>
  );
}
