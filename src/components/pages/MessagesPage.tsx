import { useMemo, useState } from "react";
import { Box, Divider, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
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

const conversations: Conversation[] = [
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

const initialMessages: ChatMessage[] = [
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
  const [activeConversationId, setActiveConversationId] = useState(
    conversations[0].id,
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ) || conversations[0],
    [activeConversationId],
  );

  const conversationMessages = useMemo(
    () =>
      messages.filter(
        (message) => message.conversationId === activeConversation.id,
      ),
    [messages, activeConversation.id],
  );

  const handleSend = () => {
    const content = newMessage.trim();

    if (!content) {
      return;
    }

    const nextMessage: ChatMessage = {
      id: String(messages.length + 1),
      conversationId: activeConversation.id,
      author: "me",
      content,
      timestamp: "Agora",
    };

    setMessages((previousMessages) => [...previousMessages, nextMessage]);
    setNewMessage("");
  };

  const rightSidebarContent = (
    <Paper sx={styles.rightSidebar} elevation={0}>
      <Text sx={styles.sidebarHeader}>Mensagens diretas</Text>
      <Divider />

      {conversations.map((conversation) => (
        <Box
          key={conversation.id}
          sx={{
            ...styles.conversationItem,
            ...(conversation.id === activeConversation.id
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
                online agora
              </Text>
            </Box>
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
              placeholder="Escreva uma mensagem..."
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
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </HomeTemplate>
  );
}
