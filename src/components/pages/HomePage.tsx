import { useState } from "react";
import { Box } from "@mui/material";
import { HomeTemplate } from "../templates";
import { Timeline, Compose, TrendingSection } from "../organisms";
import type { Post, Trend } from "../../types";

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      id: "1",
      name: "Jane Smith",
      handle: "janesmith",
      avatar: "https://i.pravatar.cc/150?img=1",
      verified: true,
    },
    content: "Just launched my new project! Check it out at the blog.",
    timestamp: new Date("2024-01-15"),
    likes: 1234,
    replies: 234,
    retweets: 567,
  },
  {
    id: "2",
    author: {
      id: "2",
      name: "John Developer",
      handle: "johndev",
      avatar: "https://i.pravatar.cc/150?img=2",
      verified: false,
    },
    content:
      "Loving the new atomic design pattern! Makes components so reusable.",
    timestamp: new Date("2024-01-14"),
    likes: 456,
    replies: 78,
    retweets: 123,
  },
];

const mockTrends: Trend[] = [
  {
    id: "1",
    category: "Technology",
    title: "#ReactJS",
    posts: 125000,
  },
  {
    id: "2",
    category: "Technology",
    title: "#TypeScript",
    posts: 98000,
  },
  {
    id: "3",
    category: "Technology",
    title: "#WebDevelopment",
    posts: 76000,
  },
];

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const handleNewPost = (content: string) => {
    const newPost: Post = {
      id: String(posts.length + 1),
      author: {
        id: "current-user",
        name: "You",
        handle: "yourhandle",
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
        <Compose onSubmit={handleNewPost} />
        <Timeline posts={posts} onLike={handleLike} />
      </Box>
      <TrendingSection trends={mockTrends} />
    </HomeTemplate>
  );
}
