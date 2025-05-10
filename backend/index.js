// backend/index.js
import express from "express";
import { sendMessageToGemini } from "./gemini.js";
import "dotenv/config";
import cors from "cors";
import { userCheck, tokenCheck } from "./login.js";
import { userRegister } from "./register.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); // Cho phép frontend gọi từ domain khác
app.use(express.json());

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

//API Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  userRegister(username, password)
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(err.status || 500).json({ error: err.error }));
});

// API save message
app.post("/save-message", (req, res) => {
  const { username, messages } = req.body;
  console.log("Received messages:", messages);
  if (!username || !messages) {
    return res.status(400).json({ error: "Missing username or messages" });
  }
  const filePath = path.join(__dirname, "data/", `${username}.json`);
  let existingMessages = [];

  // Nếu file tồn tại, đọc dữ liệu cũ
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      existingMessages = JSON.parse(data);
    } catch (err) {
      console.error("Failed to read existing messages:", err);
    }
  }

  const combinedMessages = [...existingMessages, ...messages];

  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(combinedMessages, null, 2),
      "utf8"
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save messages:", err);
    res.status(500).json({ error: "Failed to save messages" });
  }
});

// API get message
app.get("/get-history/:username", (req, res) => {
  const { username } = req.params;
  const filePath = path.join(__dirname, "data", `${username}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No chat history found" });
  }
  const data = fs.readFileSync(filePath, "utf-8");
  res.json({ messages: JSON.parse(data) });
});

// API check User Token
app.post("/user-token", async (req, res) => {
  const { token } = req.body;
  try {
    const result = await tokenCheck(token);
    res.status(result.status).json(result);
  } catch ({ error }) {
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
