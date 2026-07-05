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

type ProfilePatchBody = {
  bio: string;
  location: string;
  website: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editValues, setEditValues] = useState<ProfilePatchBody>({
    bio: "",
    location: "",
    website: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Could not load profile.");
        }

        const data = (await response.json()) as ProfileResponse;
        const nextProfile = {
          ...data,
          name: user?.name || data.name,
          handle: user?.email.split("@")[0] || data.handle,
        };

        setProfile(nextProfile);
        setEditValues({
          bio: nextProfile.bio,
          location: nextProfile.location,
          website: nextProfile.website,
        });
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleEditChange = (field: keyof ProfilePatchBody, value: string) => {
    setEditValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleEditOpen = () => {
    if (!profile) {
      return;
    }

    setEditValues({
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
    });
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!profile) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editValues),
      });

      if (!response.ok) {
        throw new Error("Could not update profile.");
      }

      const data = (await response.json()) as ProfileResponse;
      setProfile((currentProfile) =>
        currentProfile
          ? {
              ...currentProfile,
              ...data,
              name: user?.name || currentProfile.name,
              handle: user?.email.split("@")[0] || currentProfile.handle,
            }
          : data,
      );
      setIsEditing(false);
    } catch {
      setHasError(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <ProfileTemplateSkeleton />;
  }

  if (hasError || !profile) {
    return (
      <Box sx={loadingStyles}>
        <Text>Could not load profile.</Text>
      </Box>
    );
  }

  return (
    <ProfileTemplate
      profile={profile}
      isEditing={isEditing}
      isSaving={isSaving}
      editValues={editValues}
      onEditOpen={handleEditOpen}
      onEditClose={handleEditClose}
      onEditChange={handleEditChange}
      onSaveProfile={handleSaveProfile}
    />
  );
}
