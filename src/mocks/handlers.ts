import { delay, http, HttpResponse } from "msw";
import Chance from "chance";

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
  tags: string[];
  image?: string;
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

type ThreadComment = {
  id: string;
  postId: string;
  author: ThreadPostAuthor;
  content: string;
  timestamp: string;
};

type CreateCommentBody = {
  content?: string;
  author?: ThreadPostAuthor;
};

type CreatePostBody = {
  content?: string;
  author?: ThreadPostAuthor;
  tags?: string[];
  image?: string;
};

const chance = new Chance();

const conversationSeedTexts = [
  "I finished the feed layout. Can you review it with me?",
  "I pushed the new components to the feature/chat branch.",
  "Tomorrow's standup was moved to 10 AM.",
  "I found a bug in the social login flow.",
  "Can you validate the profile endpoint today?",
  "Staging deployment finished without errors.",
];

const trendCategories = ["Technology", "Design", "Business", "Startups"];
const trendTopics = [
  "#ReactJS",
  "#TypeScript",
  "#WebDevelopment",
  "#Frontend",
  "#UIUX",
  "#DevTools",
  "#JavaScript",
  "#OpenSource",
];

const postOpeners = [
  "I wrapped up",
  "I just shipped",
  "I tested",
  "Today I reviewed",
  "I improved",
  "I published",
];

const postSubjects = [
  "the login flow",
  "the messages screen",
  "the main timeline",
  "the home components",
  "the mock API integration",
  "the responsive layout",
];

const postComplements = [
  "and it is much faster now.",
  "and the tests passed across all scenarios.",
  "with focus on accessibility and performance.",
  "and navigation feels much smoother now.",
  "with a few UX improvements on mobile.",
  "and I reduced a lot of code duplication.",
];

const postTags = [
  "#frontend",
  "#react",
  "#typescript",
  "#ui",
  "#ux",
  "#webdev",
  "#testing",
  "#performance",
];

const replyOpeners = [
  "Perfect",
  "Great",
  "Sounds good",
  "Excellent",
  "Awesome",
  "Deal",
];

const replyActions = [
  "I will review this now",
  "I will send feedback by end of day",
  "I already validated this in staging",
  "I can open a PR with these adjustments",
  "I left a suggestion on the task card",
  "I can close this today",
];

const locations = [
  "New York, USA",
  "San Francisco, USA",
  "London, UK",
  "Berlin, Germany",
  "Toronto, Canada",
];

const randomAvatar = () =>
  `https://i.pravatar.cc/150?img=${chance.integer({ min: 1, max: 70 })}`;

const randomCover = () =>
  `https://picsum.photos/seed/${chance.hash({ length: 12 })}/1600/500`;

const toHandle = (name: string) => {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 12);

  return (
    normalized ||
    chance.string({ length: 8, pool: "abcdefghijklmnopqrstuvwxyz0123456789" })
  );
};

const formatClock = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const randomPostTags = () => chance.pickset(postTags, 2);

const randomPostContent = (tags: string[]) =>
  `${chance.pickone(postOpeners)} ${chance.pickone(postSubjects)} ${chance.pickone(postComplements)} ${tags.join(" ")}`;

const randomReplyContent = () =>
  `${chance.pickone(replyOpeners)}! ${chance.capitalize(chance.pickone(replyActions))}.`;

const randomBio = () =>
  `${chance.capitalize(chance.pickone(replyActions))} and ${chance.pickone([
    "I love building reusable interfaces",
    "I enjoy turning requirements into clear components",
    "I am focused on improving DX and code quality",
    "I like organizing design systems and documentation",
    "I work with React, TypeScript, and strong engineering practices",
  ])}.`;

const mockConversations: Conversation[] = Array.from({ length: 4 }).map(
  (_, index) => {
    const name = chance.name({ middle: false });

    return {
      id: String(index + 1),
      username: `${toHandle(name)}.${chance.pickone(["dev", "ui", "pm", "qa"])}`,
      avatar: randomAvatar(),
      preview: chance.pickone(conversationSeedTexts),
    };
  },
);

const mockThreadPosts: ThreadPost[] = Array.from({ length: 6 }).map(
  (_, index) => {
    const authorName = chance.name({ middle: false });
    const tags = randomPostTags();

    return {
      id: String(index + 1),
      author: {
        id: String(index + 1),
        name: authorName,
        handle: toHandle(authorName),
        avatar: randomAvatar(),
        verified: chance.bool({ likelihood: 35 }),
      },
      content: randomPostContent(tags),
      tags,
      timestamp: new Date(
        Date.now() -
          chance.integer({
            min: 60 * 60 * 1000,
            max: 21 * 24 * 60 * 60 * 1000,
          }),
      ).toISOString(),
      likes: chance.integer({ min: 30, max: 8500 }),
      replies: chance.integer({ min: 0, max: 600 }),
      retweets: chance.integer({ min: 0, max: 1200 }),
    };
  },
);

const uniqueTrendTopics: string[] = chance.unique(
  () => chance.pickone(trendTopics),
  4,
);

const mockThreadTrends: ThreadTrend[] = uniqueTrendTopics.map(
  (topic, index) => ({
    id: String(index + 1),
    category: chance.pickone(trendCategories),
    title: topic,
    posts: chance.integer({ min: 4000, max: 250000 }),
  }),
);

const mockThreadComments: ThreadComment[] = mockThreadPosts.flatMap((post) =>
  Array.from({
    length: post.replies > 0 ? chance.integer({ min: 1, max: 3 }) : 0,
  }).map((_, index) => {
    const authorName = chance.name({ middle: false });

    return {
      id: `${post.id}-${index + 1}`,
      postId: post.id,
      author: {
        id: `${post.id}-${index + 1}`,
        name: authorName,
        handle: toHandle(authorName),
        avatar: randomAvatar(),
        verified: chance.bool({ likelihood: 20 }),
      },
      content: randomReplyContent(),
      timestamp: new Date(
        Date.now() -
          chance.integer({ min: 5 * 60 * 1000, max: 5 * 24 * 60 * 60 * 1000 }),
      ).toISOString(),
    };
  }),
);

const mockMessages: Message[] = mockConversations.flatMap(
  (conversation, conversationIndex) => {
    const baseDate = new Date(
      Date.now() - (conversationIndex + 1) * 60 * 60 * 1000,
    );

    return [
      {
        id: String(conversationIndex * 2 + 1),
        conversationId: conversation.id,
        author: "contact" as const,
        content: chance.pickone(conversationSeedTexts),
        timestamp: formatClock(baseDate),
      },
      {
        id: String(conversationIndex * 2 + 2),
        conversationId: conversation.id,
        author: "me" as const,
        content: randomReplyContent(),
        timestamp: formatClock(new Date(baseDate.getTime() + 3 * 60 * 1000)),
      },
    ];
  },
);

const profileName = chance.name({ middle: false });

const mockProfile: Profile = {
  id: "1",
  name: profileName,
  handle: toHandle(profileName),
  avatar: randomAvatar(),
  cover: randomCover(),
  bio: randomBio(),
  location: chance.pickone(locations),
  website: `${chance.string({ length: 7, pool: "abcdefghijklmnopqrstuvwxyz" })}.dev/${chance.word()}`,
  joinedAt: `Joined ${chance.month().toLowerCase()} ${chance.year({ min: 2019, max: 2026 })}`,
  followers: chance.integer({ min: 120, max: 9800 }),
  following: chance.integer({ min: 50, max: 1300 }),
  posts: chance.integer({ min: 10, max: 500 }),
  verified: chance.bool({ likelihood: 40 }),
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
        id: "1",
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
  http.get("/api/threads/posts", async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const tag = url.searchParams.get("tag")?.trim();
    const q = url.searchParams.get("q")?.trim();

    let posts = mockThreadPosts;

    if (tag) {
      const normalizedTag = (
        tag.startsWith("#") ? tag : `#${tag}`
      ).toLowerCase();
      posts = posts.filter((post) =>
        post.tags.some((postTag) => postTag.toLowerCase() === normalizedTag),
      );
    }

    if (q) {
      const normalizedQuery = q.toLowerCase();
      posts = posts.filter((post) =>
        post.content.toLowerCase().includes(normalizedQuery),
      );
    }

    return HttpResponse.json({
      posts,
    });
  }),
  http.post("/api/threads/posts", async ({ request }) => {
    await delay(300);

    const body = (await request
      .json()
      .catch(() => null)) as CreatePostBody | null;

    if (!body?.content?.trim()) {
      return HttpResponse.json(
        { message: "content is required." },
        { status: 400 },
      );
    }

    const author: ThreadPostAuthor = body.author ?? {
      id: "anonymous",
      name: "Anonymous",
      handle: "anonymous",
      avatar: randomAvatar(),
    };

    const post: ThreadPost = {
      id: chance.hash({ length: 10 }),
      author,
      content: body.content.trim(),
      tags: body.tags ?? [],
      image: body.image,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0,
      retweets: 0,
    };

    mockThreadPosts.unshift(post);

    return HttpResponse.json(post, { status: 201 });
  }),
  http.get("/api/threads/posts/:id", async ({ params }) => {
    await delay(350);

    const post = mockThreadPosts.find((item) => item.id === params.id);

    if (!post) {
      return HttpResponse.json({ message: "Post not found." }, { status: 404 });
    }

    return HttpResponse.json(post);
  }),
  http.delete("/api/threads/posts/:id", async ({ params }) => {
    await delay(300);

    const postIndex = mockThreadPosts.findIndex(
      (item) => item.id === params.id,
    );

    if (postIndex === -1) {
      return HttpResponse.json({ message: "Post not found." }, { status: 404 });
    }

    mockThreadPosts.splice(postIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),
  http.get("/api/threads/posts/:id/comments", async ({ params }) => {
    await delay(300);

    const post = mockThreadPosts.find((item) => item.id === params.id);

    if (!post) {
      return HttpResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const comments = mockThreadComments.filter(
      (comment) => comment.postId === params.id,
    );

    return HttpResponse.json({ comments });
  }),
  http.post("/api/threads/posts/:id/comments", async ({ params, request }) => {
    await delay(300);

    const post = mockThreadPosts.find((item) => item.id === params.id);

    if (!post) {
      return HttpResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const body = (await request
      .json()
      .catch(() => null)) as CreateCommentBody | null;

    if (!body?.content?.trim()) {
      return HttpResponse.json(
        { message: "content is required." },
        { status: 400 },
      );
    }

    const author: ThreadPostAuthor = body.author ?? {
      id: "anonymous",
      name: "Anonymous",
      handle: "anonymous",
      avatar: randomAvatar(),
    };

    const comment: ThreadComment = {
      id: `${post.id}-${chance.hash({ length: 8 })}`,
      postId: post.id,
      author,
      content: body.content.trim(),
      timestamp: new Date().toISOString(),
    };

    mockThreadComments.push(comment);
    post.replies += 1;

    return HttpResponse.json(comment, { status: 201 });
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
      timestamp: "Now",
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
