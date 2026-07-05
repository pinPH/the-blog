import { Box } from "@mui/material";
import { Verified } from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material";
import { Avatar, Text } from "../atoms";
import type { User } from "../../types";

interface UserHeaderProps {
  user: User;
  action?: React.ReactNode;
}

const userHeaderStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
  },
  userInfo: {
    display: "flex",
    gap: 2,
    flex: 1,
    alignItems: "center",
  },
  nameSection: {
    display: "flex",
    flexDirection: "column",
    gap: 0.25,
  },
  nameLine: {
    display: "flex",
    gap: 0.5,
    alignItems: "center",
  },
};

export function UserHeader({ user, action }: UserHeaderProps) {
  return (
    <Box sx={userHeaderStyles.container}>
      <Box sx={userHeaderStyles.userInfo}>
        <Avatar src={user.avatar} alt={user.name} />
        <Box sx={userHeaderStyles.nameSection}>
          <Box sx={userHeaderStyles.nameLine}>
            <Text variant="body1" sx={{ fontWeight: 600 }}>
              {user.name}
            </Text>
            {user.verified && (
              <Verified
                fontSize="small"
                color="primary"
                titleAccess="Verificado"
              />
            )}
          </Box>
          <Text variant="body2" secondary>
            @{user.handle}
          </Text>
        </Box>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
}
