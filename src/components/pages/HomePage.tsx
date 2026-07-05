import { useEffect, useState } from "react";
import { Box, Paper, Skeleton, Stack } from "@mui/material";
import { HomeTemplate } from "../templates";
import { Timeline, Compose, TrendingSection } from "../organisms";
import { Text } from "../atoms";
import type { Post, Trend } from "../../types";
import { useAuth } from "../../hooks";

type PostsResponse = {
  posts: Array<Omit<Post, "timestamp"> & { timestamp: string }>;
};

type TrendsResponse = {
  trends: Trend[];
};

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThreadsData = async () => {
      setIsLoading(true);

      try {
        const [postsResponse, trendsResponse] = await Promise.all([
          fetch("/api/threads/posts"),
          fetch("/api/threads/trends"),
        ]);

        if (postsResponse.ok) {
          const postsData = (await postsResponse.json()) as PostsResponse;

          setPosts(
            postsData.posts.map((post) => ({
              ...post,
              timestamp: new Date(post.timestamp),
            })),
          );
        }

        if (trendsResponse.ok) {
          const trendsData = (await trendsResponse.json()) as TrendsResponse;
          setTrends(trendsData.trends);
        }
      } catch {
        setPosts([]);
        setTrends([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadThreadsData();
  }, []);

  const handleNewPost = (content: string) => {
    if (!isAuthenticated || !user) {
      return;
    }

    const newPost: Post = {
      id: String(posts.length + 1),
      author: {
        id: user.id,
        name: user.name,
        handle: user.email.split("@")[0],
        avatar: "https://i.pravatar.cc/150?img=0",
      },
      content,
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      retweets: 0,
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  return (
    <HomeTemplate>
      <Box>
        {isAuthenticated ? (
          <Compose onSubmit={handleNewPost} />
        ) : (
          <Paper
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
            elevation={0}
          >
            <Text sx={{ fontWeight: 600 }}>
              Faca login para publicar posts.
            </Text>
          </Paper>
        )}
        {isLoading ? (
          <Stack spacing={2}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Paper
                key={`timeline-skeleton-${index}`}
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
                <Skeleton width="100%" height={18} />
                <Skeleton width="90%" height={18} />
                <Skeleton width="55%" height={18} />
              </Paper>
            ))}
          </Stack>
        ) : (
          <Timeline posts={posts} onLike={handleLike} />
        )}
      </Box>
      {isLoading ? (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "background.paper",
            border: 1,
            borderColor: "divider",
          }}
          elevation={0}
        >
          <Skeleton width="60%" height={30} sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={`trends-skeleton-${index}`}>
                <Skeleton width="35%" height={14} />
                <Skeleton width="55%" height={20} />
                <Skeleton width="30%" height={14} />
              </Box>
            ))}
          </Stack>
        </Paper>
      ) : (
        <TrendingSection trends={trends} />
      )}
    </HomeTemplate>
  );
}
