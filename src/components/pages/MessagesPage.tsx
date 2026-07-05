import { useEffect, useMemo, useState } from "react";
import { Box, Divider, IconButton, Paper } from "@mui/material";
import { HomeTemplate } from "../templates";
import { Avatar, Text } from "../atoms";
import { TextInput } from "../molecules";

interface Conversation {
  id: string;
  username: string;
  avatar: string;
  preview: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  author: "me" | "contact";
  content: string;
  timestamp: string;
}

type MessagesResponse = {
  conversations: Conversation[];
  messages: ChatMessage[];
};

type CreateMessageResponse = {
  message: ChatMessage;
  conversations: Conversation[];
};

const styles = {
  page: {
    maxWidth: 880,
    mx: "auto",
    width: "100%",
  },
  chatCard: {
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid",
    borderColor: "divider",
  },
  chatHeader: {
    p: 2,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  chatBody: {
    p: 2,
    height: "58vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    backgroundColor: "background.default",
  },
  bubble: {
    px: 1.5,
    py: 1,
    borderRadius: 2,
    maxWidth: "70%",
    width: "fit-content",
  },
  bubbleContact: {
    alignSelf: "flex-start",
    backgroundColor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
  },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "primary.main",
    color: "common.white",
  },
  bubbleTime: {
    mt: 0.5,
    fontSize: "0.75rem",
    opacity: 0.8,
  },
  chatInput: {
    p: 1.5,
    display: "flex",
    gap: 1,
    alignItems: "center",
  },
  rightSidebar: {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: "background.paper",
  },
  sidebarHeader: {
    px: 2,
    py: 1.5,
    fontWeight: 700,
  },
  conversationItem: {
    display: "flex",
    gap: 1.5,
    p: 1.5,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "secondary.main",
    },
  },
  conversationItemActive: {
    backgroundColor: "secondary.main",
  },
};

export function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/messages");

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as MessagesResponse;
        setConversations(data.conversations);
        setMessages(data.messages);
        setActiveConversationId(
          (previousActiveConversationId) =>
            previousActiveConversationId || data.conversations[0]?.id || "",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ) || null,
    [activeConversationId],
  );

  const conversationMessages = useMemo(
    () =>
      activeConversation
        ? messages.filter(
            (message) => message.conversationId === activeConversation.id,
          )
        : [],
    [messages, activeConversation],
  );

  const handleSend = async () => {
    const content = newMessage.trim();

    if (!content || !activeConversation) {
      return;
    }

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: activeConversation.id,
        content,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as CreateMessageResponse;

    setMessages((previousMessages) => [...previousMessages, data.message]);
    setConversations(data.conversations);
    setNewMessage("");
  };

  const rightSidebarContent = (
    <Paper sx={styles.rightSidebar} elevation={0}>
      <Text sx={styles.sidebarHeader}>Direct messages</Text>
      <Divider />

      {conversations.map((conversation) => (
        <Box
          key={conversation.id}
          sx={{
            ...styles.conversationItem,
            ...(conversation.id === activeConversation?.id
              ? styles.conversationItemActive
              : {}),
          }}
          onClick={() => setActiveConversationId(conversation.id)}
        >
          <Avatar
            size="small"
            src={conversation.avatar}
            alt={conversation.username}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Text sx={{ fontWeight: 700 }} truncate>
              {conversation.username}
            </Text>
            <Text variant="body2" secondary truncate>
              {conversation.preview}
            </Text>
          </Box>
        </Box>
      ))}
    </Paper>
  );

  return (
    <HomeTemplate rightSidebar={rightSidebarContent}>
      <Box sx={styles.page}>
        <Paper sx={styles.chatCard} elevation={0}>
          <Box sx={styles.chatHeader}>
            {activeConversation ? (
              <>
                <Avatar
                  size="small"
                  src={activeConversation.avatar}
                  alt={activeConversation.username}
                />
                <Box>
                  <Text sx={{ fontWeight: 700 }}>
                    {activeConversation.username}
                  </Text>
                  <Text variant="caption" secondary>
                    online now
                  </Text>
                </Box>
              </>
            ) : (
              <Text sx={{ fontWeight: 700 }}>
                {isLoading ? "Loading messages..." : "No conversations"}
              </Text>
            )}
          </Box>
          <Divider />

          <Box sx={styles.chatBody}>
            {conversationMessages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  ...styles.bubble,
                  ...(message.author === "me"
                    ? styles.bubbleMe
                    : styles.bubbleContact),
                }}
              >
                <Text
                  variant="body2"
                  sx={{
                    color:
                      message.author === "me" ? "common.white" : "text.primary",
                  }}
                >
                  {message.content}
                </Text>
                <Text
                  sx={{
                    ...styles.bubbleTime,
                    color:
                      message.author === "me"
                        ? "common.white"
                        : "text.secondary",
                  }}
                >
                  {message.timestamp}
                </Text>
              </Box>
            ))}
          </Box>

          <Divider />
          <Box sx={styles.chatInput}>
            <TextInput
              placeholder="Write a message..."
              fullWidth
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <IconButton color="primary" onClick={handleSend}>
              <Text sx={{ fontWeight: 700 }}>Send</Text>
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </HomeTemplate>
  );
}
