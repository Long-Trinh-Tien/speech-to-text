// backend/index.js
import express from "express";
import { sendMessageToGemini } from "./gemini.js";
import "dotenv/config";
import cors from "cors";
import { userCheck } from "./login.js";
const app = express();
const port = 3000;

app.use(cors()); // Cho phép frontend gọi từ domain khác
app.use(express.json());

//API chat với bot
app.post("/api/message", async (req, res) => {
  const { message } = req.body;
  try {
    const geminiRes = await sendMessageToGemini(message);
    res.json(geminiRes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//API Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await userCheck(username, password);
    res.status(result.status).json(result);
  } catch ({ error }) {
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
