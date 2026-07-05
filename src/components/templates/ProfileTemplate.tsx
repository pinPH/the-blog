import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Skeleton,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Avatar, Badge, Button, Text } from "../atoms";
import { TextInput } from "../molecules";
import { HomeTemplate } from "./HomeTemplate";

type ProfileSummary = {
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  location: string;
  website: string;
  joinedAt: string;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
};

interface ProfileTemplateProps {
  profile: ProfileSummary;
  isEditing: boolean;
  isSaving: boolean;
  editValues: {
    bio: string;
    location: string;
    website: string;
  };
  onEditOpen: () => void;
  onEditClose: () => void;
  onEditChange: (field: "bio" | "location" | "website", value: string) => void;
  onSaveProfile: () => void;
}

const styles: Record<string, SxProps<Theme>> = {
  page: {
    width: "100%",
    maxWidth: 920,
    mx: "auto",
    pb: 4,
  },
  cover: {
    height: { xs: 180, md: 240 },
    borderRadius: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  card: {
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid",
    borderColor: "divider",
  },
  header: {
    px: { xs: 2, md: 3 },
    pb: 3,
  },
  avatarRow: {
    mt: -8,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 2,
    mb: 2,
  },
  identity: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    flexWrap: "wrap",
  },
  stats: {
    display: "flex",
    gap: 3,
    flexWrap: "wrap",
    mt: 2,
  },
  infoRow: {
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    mt: 2,
  },
  section: {
    mt: 3,
    p: { xs: 2, md: 3 },
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
  },
  rightSidebar: {
    display: "grid",
    gap: 2,
  },
  sidebarCard: {
    p: 2,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
  },
};

export function ProfileTemplate({
  profile,
  isEditing,
  isSaving,
  editValues,
  onEditOpen,
  onEditClose,
  onEditChange,
  onSaveProfile,
}: ProfileTemplateProps) {
  const rightSidebar = (
    <Box sx={styles.rightSidebar}>
      <Paper sx={styles.sidebarCard} elevation={0}>
        <Text sx={{ fontWeight: 700, mb: 1.5 }}>Summary</Text>
        <Text variant="body2" secondary>
          {profile.posts} shared posts focused on product, frontend, and design
          systems.
        </Text>
      </Paper>

      <Paper sx={styles.sidebarCard} elevation={0}>
        <Text sx={{ fontWeight: 700, mb: 1.5 }}>Reach</Text>
        <Text variant="body2">{profile.followers} followers</Text>
        <Text variant="body2" secondary>
          {profile.following} following
        </Text>
      </Paper>
    </Box>
  );

  return (
    <HomeTemplate rightSidebar={rightSidebar}>
      <Box sx={styles.page}>
        <Paper sx={styles.card} elevation={0}>
          <Box
            sx={{
              ...styles.cover,
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.18)), url(${profile.cover})`,
            }}
          />

          <Box sx={styles.header}>
            <Box sx={styles.avatarRow}>
              <Avatar size="large" src={profile.avatar} alt={profile.name} />
              <Button variant="outlined" onClick={onEditOpen}>
                Edit profile
              </Button>
            </Box>

            <Box sx={styles.identity}>
              <Text variant="h4" sx={{ fontWeight: 800 }}>
                {profile.name}
              </Text>
              {profile.verified ? <Badge label="Verificado" /> : null}
            </Box>

            <Text variant="body1" secondary>
              @{profile.handle}
            </Text>

            <Text sx={{ mt: 2 }}>{profile.bio}</Text>

            <Box sx={styles.infoRow}>
              <Text variant="body2" secondary>
                {profile.location}
              </Text>
              <Text variant="body2" secondary>
                {profile.website}
              </Text>
              <Text variant="body2" secondary>
                {profile.joinedAt}
              </Text>
            </Box>

            <Box sx={styles.stats}>
              <Text variant="body2">
                <strong>{profile.following}</strong> following
              </Text>
              <Text variant="body2">
                <strong>{profile.followers}</strong> followers
              </Text>
              <Text variant="body2">
                <strong>{profile.posts}</strong> posts
              </Text>
            </Box>
          </Box>
        </Paper>

        <Paper sx={styles.section} elevation={0}>
          <Text variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            About
          </Text>
          <Text secondary>
            Profile section designed to present identity, bio, and metrics in a
            dedicated authenticated area.
          </Text>
          <Divider sx={{ my: 2 }} />
          <Text secondary>
            The data on this screen is loaded through MSW mocked requests to
            keep the flow consistent during development.
          </Text>
        </Paper>
      </Box>

      <Dialog open={isEditing} onClose={onEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextInput
              label="Bio"
              value={editValues.bio}
              onChange={(event) => onEditChange("bio", event.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
            <TextInput
              label="Location"
              value={editValues.location}
              onChange={(event) => onEditChange("location", event.target.value)}
              fullWidth
            />
            <TextInput
              label="Website"
              value={editValues.website}
              onChange={(event) => onEditChange("website", event.target.value)}
              fullWidth
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                pt: 1,
              }}
            >
              <Button variant="text" onClick={onEditClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={onSaveProfile}
                isLoading={isSaving}
              >
                Save
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </HomeTemplate>
  );
}

export function ProfileTemplateSkeleton() {
  const rightSidebar = (
    <Box sx={styles.rightSidebar}>
      <Paper sx={styles.sidebarCard} elevation={0}>
        <Skeleton variant="text" width="35%" height={32} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="82%" />
      </Paper>

      <Paper sx={styles.sidebarCard} elevation={0}>
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="text" width="65%" />
        <Skeleton variant="text" width="50%" />
      </Paper>
    </Box>
  );

  return (
    <HomeTemplate rightSidebar={rightSidebar}>
      <Box sx={styles.page}>
        <Paper sx={styles.card} elevation={0}>
          <Skeleton
            variant="rectangular"
            sx={{
              ...styles.cover,
              transform: "none",
            }}
          />

          <Box sx={styles.header}>
            <Box sx={styles.avatarRow}>
              <Skeleton
                variant="circular"
                width={128}
                height={128}
                sx={{ flexShrink: 0 }}
              />
              <Skeleton
                variant="rounded"
                width={140}
                height={40}
                sx={{ borderRadius: 999 }}
              />
            </Box>

            <Box sx={styles.identity}>
              <Skeleton variant="text" width="32%" height={48} />
              <Skeleton variant="rounded" width={92} height={28} />
            </Box>

            <Skeleton variant="text" width="24%" />
            <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="78%" />

            <Box sx={styles.infoRow}>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={140} />
              <Skeleton variant="text" width={160} />
            </Box>

            <Box sx={styles.stats}>
              <Skeleton variant="text" width={110} />
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={80} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={styles.section} elevation={0}>
          <Skeleton variant="text" width="18%" height={36} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="92%" />
          <Divider sx={{ my: 2 }} />
          <Skeleton variant="text" width="96%" />
          <Skeleton variant="text" width="88%" />
        </Paper>
      </Box>
    </HomeTemplate>
  );
}
