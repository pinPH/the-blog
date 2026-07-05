import { Stack } from "@mui/material";
import { PostCard } from "../molecules";
import type { Post } from "../../types";

interface TimelineProps {
  posts: Post[];
  onLike?: (postId: string) => void;
  onReply?: (postId: string) => void;
  onRetweet?: (postId: string) => void;
  isLoading?: boolean;
}

export function Timeline({ posts, onLike, onReply, onRetweet }: TimelineProps) {
  return (
    <Stack spacing={2}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => onLike?.(post.id)}
          onReply={() => onReply?.(post.id)}
          onRetweet={() => onRetweet?.(post.id)}
        />
      ))}
    </Stack>
  );
}
