import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { HomeTemplate } from "../templates";
import { Timeline, Compose, TrendingSection } from "../organisms";
import { Text } from "../atoms";
import { TextInput } from "../molecules";
import type { Post, Trend } from "../../types";
import { useAuth } from "../../hooks";

type PostsResponse = {
  posts: Array<Omit<Post, "timestamp"> & { timestamp: string }>;
};

type TrendsResponse = {
  trends: Trend[];
};

type CreatedPostResponse = Omit<Post, "timestamp"> & { timestamp: string };

const extractHashtags = (content: string): string[] => {
  const matches = content.match(/#\w+/g) ?? [];
  const normalized = matches.map((tag) => tag.toLowerCase());

  return Array.from(new Set(normalized));
};

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const query = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(query);
  const [lastSyncedQuery, setLastSyncedQuery] = useState(query);
  const [posts, setPosts] = useState<Post[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (query !== lastSyncedQuery) {
    setLastSyncedQuery(query);
    setSearchInput(query);
  }

  useEffect(() => {
    const loadThreadsData = async () => {
      setIsLoading(true);

      try {
        const postsParams = new URLSearchParams();
        if (tag) {
          postsParams.set("tag", tag);
        }
        if (query) {
          postsParams.set("q", query);
        }
        const postsQueryString = postsParams.toString();

        const [postsResponse, trendsResponse] = await Promise.all([
          fetch(
            `/api/threads/posts${postsQueryString ? `?${postsQueryString}` : ""}`,
          ),
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
  }, [tag, query]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextParams = new URLSearchParams(searchParams);
    const trimmedSearch = searchInput.trim();

    if (trimmedSearch) {
      nextParams.set("q", trimmedSearch);
    } else {
      nextParams.delete("q");
    }

    setSearchParams(nextParams);
  };

  const handleClearTag = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("tag");
    setSearchParams(nextParams);
  };

  const handleNewPost = async (content: string) => {
    if (!isAuthenticated || !user) {
      return;
    }

    const tags = extractHashtags(content);

    try {
      const response = await fetch("/api/threads/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          tags,
          author: {
            id: user.id,
            name: user.name,
            handle: user.email.split("@")[0],
            avatar: "https://i.pravatar.cc/150?img=0",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create post.");
      }

      const data = (await response.json()) as CreatedPostResponse;
      const createdPost: Post = {
        ...data,
        timestamp: new Date(data.timestamp),
      };

      setPosts((currentPosts) => [createdPost, ...currentPosts]);
    } catch {
      // Keep UX responsive: if the request fails, do not break the timeline state.
    }
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId),
    );
  };

  return (
    <HomeTemplate>
      <Box>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
          elevation={0}
        >
          <TextInput
            placeholder="Search posts..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            fullWidth
            size="small"
            data-testid="search-input"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    size="small"
                    aria-label="search"
                    data-testid="search-submit"
                  >
                    <Search fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {tag && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 1.5,
              }}
              data-testid="active-tag-filter"
            >
              <Text sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                Filtering by <strong>{tag}</strong>
              </Text>
              <IconButton
                size="small"
                aria-label="clear tag filter"
                onClick={handleClearTag}
                data-testid="clear-tag-filter"
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Paper>
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
            <Text sx={{ fontWeight: 600 }}>Log in to publish posts.</Text>
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
        ) : posts.length === 0 ? (
          <Box
            sx={{ p: 4, textAlign: "center" }}
            data-testid="posts-empty-state"
          >
            <Text sx={{ fontWeight: 600 }}>No posts found.</Text>
            <Text secondary>Try a different search term or tag.</Text>
          </Box>
        ) : (
          <Timeline
            posts={posts}
            onLike={handleLike}
            onDeleted={handlePostDeleted}
          />
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
