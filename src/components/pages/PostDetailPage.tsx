import { useEffect, useState } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { Box, Paper, Skeleton, Stack } from "@mui/material";
import { HomeTemplate } from "../templates";
import { UserHeader } from "../molecules/UserHeader";
import { Avatar, Button, Text } from "../atoms";
import type { Comment, Post } from "../../types";
import { useAuth } from "../../hooks";

type PostResponse = Omit<Post, "timestamp"> & { timestamp: string };

type CommentResponse = Omit<Comment, "timestamp"> & { timestamp: string };

type CommentsResponse = {
  comments: CommentResponse[];
};

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

const commentComposeStyles = {
  display: "flex",
  gap: 1.5,
};

const commentTextareaStyles: React.CSSProperties = {
  width: "100%",
  fontSize: "14px",
  fontFamily: "inherit",
  border: "none",
  outline: "none",
  resize: "none",
  minHeight: "40px",
};

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

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

  useEffect(() => {
    const loadComments = async () => {
      setIsLoadingComments(true);

      try {
        const response = await fetch(`/api/threads/posts/${id}/comments`);

        if (!response.ok) {
          setComments([]);
          return;
        }

        const data = (await response.json()) as CommentsResponse;

        setComments(
          data.comments.map((comment) => ({
            ...comment,
            timestamp: new Date(comment.timestamp),
          })),
        );
      } catch {
        setComments([]);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated || !user || !commentContent.trim()) {
      return;
    }

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const response = await fetch(`/api/threads/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentContent,
          author: {
            id: user.id,
            name: user.name,
            handle: user.email.split("@")[0],
            avatar: "https://i.pravatar.cc/150?img=0",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create comment.");
      }

      const data = (await response.json()) as CommentResponse;
      const newComment: Comment = {
        ...data,
        timestamp: new Date(data.timestamp),
      };

      setComments((currentComments) => [newComment, ...currentComments]);
      setPost((currentPost) =>
        currentPost
          ? { ...currentPost, replies: currentPost.replies + 1 }
          : currentPost,
      );
      setCommentContent("");
    } catch {
      setCommentError("Could not post your comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
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
          {post.tags && post.tags.length > 0 && (
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
              data-testid="post-tags"
            >
              {post.tags.map((tag) => (
                <RouterLink
                  key={tag}
                  to={`/?tag=${encodeURIComponent(tag)}`}
                  style={{ textDecoration: "none" }}
                  data-testid={`post-tag-${tag.replace("#", "")}`}
                >
                  <Text
                    sx={{
                      fontSize: "0.85rem",
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {tag}
                  </Text>
                </RouterLink>
              ))}
            </Box>
          )}
          <Box sx={actionsStyles}>
            <div>💬 {post.replies}</div>
            <div>🔄 {post.retweets}</div>
            <div>❤️ {post.likes}</div>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2, mt: 2, border: "1px solid", borderColor: "divider" }}
          data-testid="comments-section"
        >
          <Text variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Comments
          </Text>

          {isAuthenticated ? (
            <Box sx={{ mb: 2 }}>
              <Box sx={commentComposeStyles}>
                <Avatar size="small" />
                <Box sx={{ flex: 1 }}>
                  <textarea
                    placeholder="Write a comment..."
                    style={commentTextareaStyles}
                    value={commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                    data-testid="comment-input"
                  />
                  {commentError && (
                    <Text
                      sx={{ color: "error.main", fontSize: "0.8rem", mb: 1 }}
                    >
                      {commentError}
                    </Text>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      disabled={!commentContent.trim() || isSubmittingComment}
                      isLoading={isSubmittingComment}
                      onClick={handleSubmitComment}
                      data-testid="comment-submit"
                    >
                      {isSubmittingComment ? "Posting..." : "Comment"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Paper
              sx={{ p: 2, mb: 2, border: "1px solid", borderColor: "divider" }}
              elevation={0}
            >
              <Text sx={{ fontWeight: 600 }}>Log in to comment.</Text>
            </Paper>
          )}

          {isLoadingComments ? (
            <Stack spacing={2}>
              {Array.from({ length: 2 }).map((_, index) => (
                <Box
                  key={`comment-skeleton-${index}`}
                  sx={{ display: "flex", gap: 1.5 }}
                >
                  <Skeleton variant="circular" width={36} height={36} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="30%" height={16} />
                    <Skeleton width="80%" height={16} />
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : comments.length === 0 ? (
            <Text secondary data-testid="comments-empty-state">
              No comments yet.
            </Text>
          ) : (
            <Stack spacing={2} data-testid="comments-list">
              {comments.map((comment) => (
                <Box key={comment.id} sx={{ display: "flex", gap: 1.5 }}>
                  <Avatar src={comment.author.avatar} size="small" />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                    >
                      <Text sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {comment.author.name}
                      </Text>
                      <Text secondary sx={{ fontSize: "0.8rem" }}>
                        @{comment.author.handle}
                      </Text>
                    </Box>
                    <Text sx={{ fontSize: "0.9rem" }}>{comment.content}</Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </HomeTemplate>
  );
}
