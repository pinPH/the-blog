import { Box, Card } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { UserHeader } from './UserHeader';
import { Text } from '../atoms';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onReply?: () => void;
  onRetweet?: () => void;
}

const postCardStyles: Record<string, SxProps<Theme>> = {
  container: {
    p: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
  },
  content: {
    mt: 2,
    mb: 2,
  },
  image: {
    width: '100%',
    borderRadius: 1,
    mt: 1,
    mb: 1,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    pt: 1,
    color: 'text.secondary',
    '& > div': {
      display: 'flex',
      gap: 0.5,
      fontSize: '0.75rem',
    },
  },
  timestamp: {
    fontSize: '0.75rem',
    color: 'text.secondary',
    mb: 1,
  },
};

export function PostCard({
  post,
  onLike,
  onReply,
  onRetweet,
}: PostCardProps) {
  return (
    <Card sx={postCardStyles.container}>
      <UserHeader user={post.author} />
      <Text sx={postCardStyles.timestamp}>
        {new Date(post.timestamp).toLocaleDateString()}
      </Text>
      <Box sx={postCardStyles.content}>
        <Text variant="body1">{post.content}</Text>
        {post.image && (
          <img src={post.image} alt="post" style={{ ...postCardStyles.image as any }} />
        )}
      </Box>
      <Box sx={postCardStyles.actions}>
        <div onClick={onReply}>💬 {post.replies}</div>
        <div onClick={onRetweet}>🔄 {post.retweets}</div>
        <div onClick={onLike}>❤️ {post.likes}</div>
      </Box>
    </Card>
  );
}
