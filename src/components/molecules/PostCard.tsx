import { Box, Card } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { UserHeader } from "./UserHeader";
import { Text } from "../atoms";
import type { Post } from "../../types";

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onReply?: () => void;
  onRetweet?: () => void;
}

const postCardStyles: Record<string, SxProps<Theme>> = {
  container: {
    p: 1,
    borderBottom: "1px solid",
    borderColor: "divider",
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.03)",
    },
  },
  content: {
    mt: 1,
    mb: 2,
  },
  image: {
    width: "100%",
    borderRadius: 1,
    mt: 1,
    mb: 1,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    mb: 1,
  },
  tag: {
    fontSize: "0.85rem",
    color: "primary.main",
    fontWeight: 600,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
    pt: 1,
    color: "text.secondary",
    "& > div": {
      display: "flex",
      gap: 0.5,
      fontSize: "0.75rem",
    },
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "text.secondary",
    mb: 1,
  },
};

export function PostCard({ post, onLike, onReply, onRetweet }: PostCardProps) {
  const navigate = useNavigate();

  const handleNavigateToPost = () => {
    navigate(`/post/${post.id}`);
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLDivElement>,
    action?: () => void,
  ) => {
    event.stopPropagation();
    action?.();
  };

  return (
    <Card sx={postCardStyles.container} onClick={handleNavigateToPost}>
      <UserHeader user={post.author} />
      <Text sx={postCardStyles.timestamp}>
        {new Date(post.timestamp).toLocaleDateString()}
      </Text>
      <Box sx={postCardStyles.content}>
        <Text variant="body1">{post.content}</Text>
        {post.image && (
          <img
            src={post.image}
            alt="post"
            style={{ ...(postCardStyles.image as any) }}
          />
        )}
      </Box>
      {post.tags && post.tags.length > 0 && (
        <Box sx={postCardStyles.tags} data-testid="post-tags">
          {post.tags.map((tag) => (
            <RouterLink
              key={tag}
              to={`/?tag=${encodeURIComponent(tag)}`}
              onClick={(event) => event.stopPropagation()}
              style={{ textDecoration: "none" }}
              data-testid={`post-tag-${tag.replace("#", "")}`}
            >
              <Text sx={postCardStyles.tag}>{tag}</Text>
            </RouterLink>
          ))}
        </Box>
      )}
      <Box sx={postCardStyles.actions}>
        <div onClick={(event) => handleActionClick(event, onReply)}>
          💬 {post.replies}
        </div>
        <div onClick={(event) => handleActionClick(event, onRetweet)}>
          🔄 {post.retweets}
        </div>
        <div onClick={(event) => handleActionClick(event, onLike)}>
          ❤️ {post.likes}
        </div>
      </Box>
    </Card>
  );
}
