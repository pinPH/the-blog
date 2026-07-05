import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ProfileTemplate, ProfileTemplateSkeleton } from "../templates";
import { Text } from "../atoms";
import { useAuth } from "../../hooks";

type ProfileResponse = {
  id: string;
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

const loadingStyles = {
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar o perfil.");
        }

        const data = (await response.json()) as ProfileResponse;
        setProfile({
          ...data,
          name: user?.name || data.name,
          handle: user?.email.split("@")[0] || data.handle,
        });
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (isLoading) {
    return <ProfileTemplateSkeleton />;
  }

  if (hasError || !profile) {
    return (
      <Box sx={loadingStyles}>
        <Text>Nao foi possivel carregar o profile.</Text>
      </Box>
    );
  }

  return <ProfileTemplate profile={profile} />;
}
