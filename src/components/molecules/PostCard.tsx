import { useState } from "react";
import { Box, Card, IconButton } from "@mui/material";
import {
  DeleteOutline,
  ChatBubbleOutline,
  Repeat,
  FavoriteBorder,
} from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { UserHeader } from "./UserHeader";
import { ConfirmDialog } from "./ConfirmDialog";
import { Text } from "../atoms";
import { useAuth } from "../../hooks";
import type { Post } from "../../types";

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onReply?: () => void;
  onRetweet?: () => void;
  onDeleted?: (postId: string) => void;
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
      alignItems: "center",
      gap: 0.5,
      fontSize: "0.75rem",
    },
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "text.secondary",
    mb: 1,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1,
  },
};

export function PostCard({
  post,
  onLike,
  onReply,
  onRetweet,
  onDeleted,
}: PostCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canDelete = Boolean(isAuthenticated && user?.id === post.author.id);

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

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/threads/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete post.");
      }

      setIsDeleteDialogOpen(false);
      onDeleted?.(post.id);
    } catch {
      setDeleteError("Could not delete this post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card sx={postCardStyles.container} onClick={handleNavigateToPost}>
      <Box sx={postCardStyles.header}>
        <UserHeader user={post.author} />
        {canDelete && (
          <IconButton
            size="small"
            aria-label="delete post"
            onClick={handleDeleteClick}
            data-testid={`delete-post-${post.id}`}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        )}
      </Box>
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
          <ChatBubbleOutline fontSize="small" /> {post.replies}
        </div>
        <div onClick={(event) => handleActionClick(event, onRetweet)}>
          <Repeat fontSize="small" /> {post.retweets}
        </div>
        <div onClick={(event) => handleActionClick(event, onLike)}>
          <FavoriteBorder fontSize="small" /> {post.likes}
        </div>
      </Box>
      {canDelete && (
        <Box onClick={(event) => event.stopPropagation()}>
          <ConfirmDialog
            open={isDeleteDialogOpen}
            title="Delete post?"
            description="This action cannot be undone. The post will be permanently removed."
            confirmLabel="Delete"
            isConfirming={isDeleting}
            errorMessage={deleteError}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            data-testid={`delete-post-dialog-${post.id}`}
          />
        </Box>
      )}
    </Card>
  );
}
