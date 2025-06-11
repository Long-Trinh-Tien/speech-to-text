// Aligns the chat message to the left or right based on the user
import { useState } from "react";
import { MessageBox } from "react-chat-elements";
import TextToSpeech from "../function/text-to-speech";

export default function ChatMessage({ msg }) {
  const [translated, setTranslated] = useState("");
  const isUser = msg.user !== "bot";

  const handleMouseUp = async () => {
    const selectedText = window.getSelection().toString().trim();
    const originalText = typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text);
    console.log("Selected:", selectedText);
    console.log("Original msg.text:", msg.text);
    console.log("OriginalText as string:", originalText);

    if (!selectedText || !originalText.includes(selectedText)) return;

    try {
      const res = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText }),
      });

      const data = await res.json();
      console.log("Dữ liệu nhận được từ /translate:", data);

      const translatedText =
        data?.translated?.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể dịch văn bản.";

      setTranslated(translatedText.replace(/\n/g, ""));



    } catch (err) {
      console.error("Lỗi khi dịch:", err);
      setTranslated("Có lỗi xảy ra khi dịch.");
    }
  };
  const displayText =
    typeof msg.text === "string"
      ? msg.text
      : JSON.stringify(msg.text ?? "No text"); // fallback nếu là object

  console.log("msg.text:", displayText); // kiểm tra



  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
          alignItems: "center",
        }}
      >
        {isUser ? (
          <>
            <div style={{ flexShrink: 0 }}>
              <TextToSpeech inputText={displayText} />
            </div>
            <div onMouseUp={handleMouseUp} style={{ userSelect: "text", maxWidth: "80%" }}>
              <MessageBox
                position={msg.position}
                type={msg.type}
                title={msg.title}
                text={displayText}
                date={msg.date ? new Date(msg.date) : new Date()} //
              />
            </div>
          </>
        ) : (
          <>
            <div onMouseUp={handleMouseUp} style={{ userSelect: "text", maxWidth: "80%" }}>
              <MessageBox
                position={msg.position}
                type={msg.type}
                title={msg.title}
                text={displayText}
                date={msg.date ? new Date(msg.date) : new Date()} //
              />
            </div>
            <div style={{ flexShrink: 0 }}>
              <TextToSpeech inputText={displayText} />
            </div>
          </>
        )}
      </div>

      {translated && (
        <div
          style={{
            backgroundColor: "#e6f7ff",
            padding: "6px 10px",
            borderRadius: "6px",
            marginTop: "4px",
            color: "#333",
            fontSize: "0.9rem",
            maxWidth: "80%",
          }}
        >
          <strong>Bản dịch:</strong> {translated}
        </div>
      )}
    </div>
  );
}


