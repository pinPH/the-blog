import { delay, http, HttpResponse } from "msw";

type LoginBody = {
  username?: string;
  email?: string;
  password?: string;
};

type Conversation = {
  id: string;
  username: string;
  avatar: string;
  preview: string;
};

type Message = {
  id: string;
  conversationId: string;
  author: "me" | "contact";
  content: string;
  timestamp: string;
};

type CreateMessageBody = {
  conversationId?: string;
  content?: string;
};

type Profile = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  location: string;
  website: string;
  joinedAt: string;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
};

type UpdateProfileBody = {
  bio?: string;
  location?: string;
  website?: string;
};

type ThreadPostAuthor = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
};

type ThreadPost = {
  id: string;
  author: ThreadPostAuthor;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  retweets: number;
};

type ThreadTrend = {
  id: string;
  category: string;
  title: string;
  posts: number;
};

const mockConversations: Conversation[] = [
  {
    id: "1",
    username: "ana.dev",
    avatar: "https://i.pravatar.cc/150?img=11",
    preview: "Fechei o layout do feed. Quer revisar comigo?",
  },
  {
    id: "2",
    username: "bruno.ui",
    avatar: "https://i.pravatar.cc/150?img=12",
    preview: "Subi os componentes novos no branch feature/chat.",
  },
  {
    id: "3",
    username: "camila.pm",
    avatar: "https://i.pravatar.cc/150?img=13",
    preview: "A daily de amanha passou para 10h.",
  },
  {
    id: "4",
    username: "diego.qa",
    avatar: "https://i.pravatar.cc/150?img=14",
    preview: "Encontrei um bug no fluxo de login social.",
  },
];

const mockThreadPosts: ThreadPost[] = [
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
    timestamp: "2024-01-15T00:00:00.000Z",
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
    timestamp: "2024-01-14T00:00:00.000Z",
    likes: 456,
    replies: 78,
    retweets: 123,
  },
];

const mockThreadTrends: ThreadTrend[] = [
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

const mockMessages: Message[] = [
  {
    id: "1",
    conversationId: "1",
    author: "contact",
    content: "Oi! Conseguiu olhar os ajustes da timeline?",
    timestamp: "09:41",
  },
  {
    id: "2",
    conversationId: "1",
    author: "me",
    content: "Vi sim. A estrutura ficou boa, so vou alinhar os espacamentos.",
    timestamp: "09:44",
  },
  {
    id: "3",
    conversationId: "1",
    author: "contact",
    content: "Perfeito. Te mando a versao final em seguida.",
    timestamp: "09:45",
  },
  {
    id: "4",
    conversationId: "2",
    author: "contact",
    content: "Atualizei os cards com tipagem forte e testes basicos.",
    timestamp: "08:33",
  },
  {
    id: "5",
    conversationId: "3",
    author: "contact",
    content: "Pode validar os criterios da sprint?",
    timestamp: "Ontem",
  },
];

const mockProfile: Profile = {
  id: "1",
  name: "Demo User",
  handle: "demo",
  avatar: "https://i.pravatar.cc/150?img=15",
  cover:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  bio: "Construindo a interface do The Blog com foco em componentes reutilizaveis.",
  location: "Sao Paulo, BR",
  website: "theblog.dev/demo",
  joinedAt: "Entrou em janeiro de 2024",
  followers: 1284,
  following: 312,
  posts: 87,
  verified: true,
};

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    await delay(1200);

    const body = (await request.json().catch(() => null)) as LoginBody | null;

    if ((!body?.username && !body?.email) || !body?.password) {
      return HttpResponse.json(
        { message: "Username/email and password are required." },
        { status: 400 },
      );
    }

    if (body.password !== "coxinha123") {
      return HttpResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      token: "mock-jwt-token",
      user: {
        id: 1,
        name: body.username || "Demo User",
        email: body.email || "demo@theblog.com",
      },
    });
  }),
  http.get("/api/profile", async () => {
    await delay(400);

    return HttpResponse.json(mockProfile);
  }),
  http.patch("/api/profile", async ({ request }) => {
    await delay(300);

    const body = (await request
      .json()
      .catch(() => null)) as UpdateProfileBody | null;

    mockProfile.bio = body?.bio?.trim() || mockProfile.bio;
    mockProfile.location = body?.location?.trim() || mockProfile.location;
    mockProfile.website = body?.website?.trim() || mockProfile.website;

    return HttpResponse.json(mockProfile);
  }),
  http.get("/api/messages", async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversationId");

    const messages = conversationId
      ? mockMessages.filter(
          (message) => message.conversationId === conversationId,
        )
      : mockMessages;

    return HttpResponse.json({
      conversations: mockConversations,
      messages,
    });
  }),
  http.get("/api/threads/posts", async () => {
    await delay(350);

    return HttpResponse.json({
      posts: mockThreadPosts,
    });
  }),
  http.get("/api/threads/trends", async () => {
    await delay(350);

    return HttpResponse.json({
      trends: mockThreadTrends,
    });
  }),
  http.get("/api/threads", async () => {
    await delay(350);

    return HttpResponse.json({
      posts: mockThreadPosts,
      trends: mockThreadTrends,
    });
  }),
  http.post("/api/messages", async ({ request }) => {
    await delay(250);

    const body = (await request
      .json()
      .catch(() => null)) as CreateMessageBody | null;

    if (!body?.conversationId || !body?.content?.trim()) {
      return HttpResponse.json(
        { message: "conversationId and content are required." },
        { status: 400 },
      );
    }

    const conversation = mockConversations.find(
      (item) => item.id === body.conversationId,
    );

    if (!conversation) {
      return HttpResponse.json(
        { message: "Conversation not found." },
        { status: 404 },
      );
    }

    const nextMessage: Message = {
      id: String(mockMessages.length + 1),
      conversationId: body.conversationId,
      author: "me",
      content: body.content.trim(),
      timestamp: "Agora",
    };

    mockMessages.push(nextMessage);
    conversation.preview = nextMessage.content;

    return HttpResponse.json(
      {
        message: nextMessage,
        conversations: mockConversations,
      },
      { status: 201 },
    );
  }),
];
