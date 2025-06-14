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

// API translate text
app.post("/translate", async (req, res) => {
  const { text } = req.body;
  if (!text)
    return res.status(400).json({ error: "Missing text to translate" });

  try {
    const prompt = `
Dịch đoạn văn sau sang tiếng Việt và cung cấp phiên âm IPA tiếng Anh.

Đoạn văn: "${text}"

Trả về theo định dạng:
Dịch: <bản dịch>
IPA: <phiên âm IPA>
`;

    const response = await sendMessageToGemini(prompt);

    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const match = rawText.match(/Dịch:\s*(.*?)\s*IPA:\s*(.*)/is);
    const translatedText = match?.[1]?.trim() || "Không thể dịch văn bản.";
    const ipa = match?.[2]?.trim() || "";

    res.json({
      translated: { text: translatedText },
      ipa: ipa,
    });
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});

// API save vocabulary
app.post("/save-vocab", (req, res) => {
  const { username, word, meaning, ipa } = req.body;

  if (!username || !word || !meaning) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const filePath = path.join(__dirname, "data", `${username}_vocab.json`);
  let existingVocab = [];

  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      existingVocab = JSON.parse(data);
    } catch (err) {
      console.error("Failed to read vocab file:", err);
    }
  }

  const newVocab = {
    word,
    meaning,
    ipa,
    savedAt: new Date().toISOString(),
  };

  const updatedVocab = [...existingVocab, newVocab];

  try {
    fs.writeFileSync(filePath, JSON.stringify(updatedVocab, null, 2), "utf8");
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save vocab:", err);
    res.status(500).json({ error: "Failed to save vocabulary" });
  }
});

app.get("/get-vocab", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  const filePath = path.join(__dirname, "data", `${username}_vocab.json`);

  if (!fs.existsSync(filePath)) {
    return res.json([]); // Trả về mảng rỗng nếu chưa có từ
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const vocabList = JSON.parse(data);
    res.json(vocabList);
  } catch (err) {
    console.error("Failed to read vocab file:", err);
    res.status(500).json({ error: "Failed to read vocabulary" });
  }
});

app.post("/delete-vocab", (req, res) => {
  const { username, word } = req.body;

  if (!username || !word) {
    return res.status(400).json({ error: "Missing username or word" });
  }

  const filePath = path.join(__dirname, "data", `${username}_vocab.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No vocab file found" });
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    let vocabList = JSON.parse(data);
    const updatedList = vocabList.filter((v) => v.word !== word);

    fs.writeFileSync(filePath, JSON.stringify(updatedList, null, 2), "utf8");
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete vocab:", err);
    res.status(500).json({ error: "Failed to delete vocab" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
