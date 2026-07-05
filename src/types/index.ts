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
}

export interface Trend {
  id: string;
  category: string;
  title: string;
  posts: number;
}
