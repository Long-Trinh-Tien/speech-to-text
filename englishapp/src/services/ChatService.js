import { sendMessageToBackend } from "../function/sendMessageToBackend";

export async function sendMessage(username, text) {
  const userMessage = createMessage(username, text, "right");
  const res = await sendMessageToBackend(
    (text +=
      "Please answer the user in a natural, conversational way. After giving your answer, always ask an interesting follow-up question to keep the conversation going")
  );
  const botText =
    res?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response? Enable backend.";
  const botMessage = createMessage("bot", botText, "left");

  await saveMessages(username, [userMessage, botMessage]);
  return [userMessage, botMessage];
}

export function createMessage(user, text, position) {
  const textStr = typeof text === "string" ? text : JSON.stringify(text);
  return {
    user,
    text: textStr,
    date: new Date(),
    type: "text",
    title: user === "bot" ? "AI Agent" : user,
    position,
  };
}

export async function saveMessages(username, messages) {
  await fetch("http://localhost:3000/save-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, messages }),
  });
}

export async function fetchHistory(username) {
  const res = await fetch(`http://localhost:3000/get-history/${username}`);
  const data = await res.json();
  const safeMessages = (data?.messages || []).map((msg) => ({
    ...msg,
    text: typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text),
    date: new Date(msg.date), // Chắc chắn đúng kiểu Date
  }));

  return safeMessages;
}

export async function translateText(text) {
  try {
    const res = await fetch("http://localhost:3000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    return {
      text: data?.translated?.text || "Không thể dịch văn bản.",
      ipa: data?.ipa || "",
    };
  } catch (err) {
    console.error("Error translate:", err);
    return {
      text: "Error.",
      ipa: "",
    };
  }
}

export async function saveVocabulary(username, word, meaning, ipa) {
  try {
    const res = await fetch("http://localhost:3000/save-vocab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        word,
        meaning,
        ipa,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save vocabulary");
    }

    return await res.json();
  } catch (err) {
    console.error("Error saving vocabulary:", err);
    return { success: false, error: err.message };
  }
}
