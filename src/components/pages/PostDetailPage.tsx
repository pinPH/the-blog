import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Paper, Skeleton, Stack } from "@mui/material";
import { HomeTemplate } from "../templates";
import { UserHeader } from "../molecules/UserHeader";
import { Button, Text } from "../atoms";
import type { Post } from "../../types";

type PostResponse = Omit<Post, "timestamp"> & { timestamp: string };

const actionsStyles = {
  display: "flex",
  justifyContent: "space-around",
  pt: 2,
  mt: 2,
  borderTop: "1px solid",
  borderColor: "divider",
  color: "text.secondary",
  "& > div": {
    display: "flex",
    gap: 0.5,
    fontSize: "0.9rem",
  },
};

const errorContainerStyles = {
  minHeight: "60vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
};

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      setHasError(false);
      setPost(null);

      try {
        const response = await fetch(`/api/threads/posts/${id}`);

        if (!response.ok) {
          throw new Error("Could not load post.");
        }

        const data = (await response.json()) as PostResponse;

        setPost({
          ...data,
          timestamp: new Date(data.timestamp),
        });
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <HomeTemplate>
        <Paper
          elevation={0}
          sx={{ p: 2, border: "1px solid", borderColor: "divider" }}
        >
          <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
            <Skeleton variant="circular" width={44} height={44} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="40%" height={18} />
              <Skeleton width="25%" height={16} />
            </Box>
          </Box>
          <Stack spacing={1}>
            <Skeleton width="100%" height={18} />
            <Skeleton width="90%" height={18} />
            <Skeleton width="55%" height={18} />
          </Stack>
        </Paper>
      </HomeTemplate>
    );
  }

  if (hasError || !post) {
    return (
      <HomeTemplate>
        <Box sx={errorContainerStyles}>
          <Text variant="h5" sx={{ fontWeight: 700 }}>
            Post not found
          </Text>
          <Text secondary>This post does not exist or was removed.</Text>
          <Button variant="contained" onClick={handleBack}>
            Back to timeline
          </Button>
        </Box>
      </HomeTemplate>
    );
  }

  return (
    <HomeTemplate>
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Button variant="text" onClick={handleBack}>
            ← Back
          </Button>
        </Box>
        <Paper
          elevation={0}
          sx={{ p: 2, border: "1px solid", borderColor: "divider" }}
        >
          <UserHeader user={post.author} />
          <Text sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 1 }}>
            {new Date(post.timestamp).toLocaleString()}
          </Text>
          <Box sx={{ mt: 1, mb: 2 }}>
            <Text variant="body1">{post.content}</Text>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
              />
            )}
          </Box>
          <Box sx={actionsStyles}>
            <div>💬 {post.replies}</div>
            <div>🔄 {post.retweets}</div>
            <div>❤️ {post.likes}</div>
          </Box>
        </Paper>
      </Box>
    </HomeTemplate>
  );
}
