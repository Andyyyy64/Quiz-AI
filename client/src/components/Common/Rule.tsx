import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export const Rule: React.FC = () => {
  return (
    <Box
      className="bg-white p-6 shadow-lg rounded-lg"
      sx={{
        width: "100%",
        maxWidth: 600,
        textAlign: "center",
        mb: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" className="font-bold mb-4">
        クイズバトルのルール
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="・早押し形式でスピード勝負！" />
        </ListItem>
        <ListItem>
          <ListItemText primary="・5点先取で勝利です" />
        </ListItem>
        <ListItem>
          <ListItemText primary="・ジャンル、難易度は無差別" />
        </ListItem>
        <ListItem>
          <ListItemText primary="・ランクは対戦ごとに変動します" />
        </ListItem>
        <ListItem>
          <ListItemText primary="・対戦相手は実際のユーザーです！" />
        </ListItem>
        <ListItem>
          <ListItemText primary="・問題と回答はAIが生成しています" />
        </ListItem>
      </List>
    </Box>
  );
};
