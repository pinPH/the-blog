import { Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { PostCard } from "../molecules";
import type { Post } from "../../types";

interface TimelineProps {
  posts: Post[];
  onLike?: (postId: string) => void;
  onReply?: (postId: string) => void;
  onRetweet?: (postId: string) => void;
  isLoading?: boolean;
}

const timelineStyles: Record<string, SxProps<Theme>> = {
  container: {
    borderLeft: "1px solid",
    borderRight: "1px solid",
    borderColor: "divider",
    minHeight: "100vh",
  },
};

export function Timeline({ posts, onLike, onReply, onRetweet }: TimelineProps) {
  return (
    <Paper sx={timelineStyles.container} elevation={0}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => onLike?.(post.id)}
          onReply={() => onReply?.(post.id)}
          onRetweet={() => onRetweet?.(post.id)}
        />
      ))}
    </Paper>
  );
}
