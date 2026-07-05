import { Box, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Text } from "../atoms";
import type { Trend } from "../../types";

interface TrendingSectionProps {
  trends: Trend[];
}

const trendingStyles: Record<string, SxProps<Theme>> = {
  container: {
    p: 2,
    borderRadius: 2,
    backgroundColor: "secondary.main",
  },
  title: {
    fontWeight: 700,
    fontSize: "1.25rem",
    mb: 2,
  },
  trendItem: {
    mb: 2,
    p: 2,
    borderRadius: 1,
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
  },
  trendCategory: {
    fontSize: "0.75rem",
    color: "text.secondary",
  },
  trendTitle: {
    fontWeight: 700,
    fontSize: "1rem",
    my: 0.5,
  },
  trendCount: {
    fontSize: "0.75rem",
    color: "text.secondary",
  },
};

export function TrendingSection({ trends }: TrendingSectionProps) {
  return (
    <Paper sx={trendingStyles.container} elevation={0}>
      <Text sx={trendingStyles.title}>What's happening</Text>
      <Box>
        {trends.map((trend) => (
          <Box key={trend.id} sx={trendingStyles.trendItem}>
            <Text sx={trendingStyles.trendCategory}>
              {trend.category} Trending
            </Text>
            <Text sx={trendingStyles.trendTitle}>{trend.title}</Text>
            <Text sx={trendingStyles.trendCount}>
              {trend.posts.toLocaleString()} posts
            </Text>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
