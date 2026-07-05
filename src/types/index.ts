export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  followers?: number;
  verified?: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  replies: number;
  retweets: number;
  image?: string;
  liked?: boolean;
  tags?: string[];
}

export interface Trend {
  id: string;
  category: string;
  title: string;
  posts: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  timestamp: Date;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  timestamp: Date;
}
