//import { useState } from "react";
import { UserContext } from "../function/UserContext";
import { MessageBox } from "react-chat-elements";
import TextToSpeech from "../function/text-to-speech";
import { translateText } from "../services/ChatService";
import { saveVocabulary } from "../services/ChatService";
import React, { useContext, useState } from "react";


export default function ChatMessage({ msg }) {
  const [translated, setTranslated] = useState({ text: "", ipa: "" });
  const isUser = msg.user !== "bot";
  const [selectedText, setSelectedText] = useState("");
  const [showSaveOption, setShowSaveOption] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" hoặc "error"


  const { username } = useContext(UserContext);

  const handleMouseUp = async () => {
    const selectedText = window.getSelection().toString().trim();
    const originalText = typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text);

    if (!selectedText || !originalText.includes(selectedText)) return;

    const result = await translateText(selectedText);


    setTranslated({
      text: result.text?.replace(/\n/g, "") || "Can not translate.",
      ipa: result.ipa?.replace(/\n/g, "") || "",
    });
    setSelectedText(selectedText);
    setShowSaveOption(true);
  };
  const handleSaveVocabulary = async () => {

    try {
      const result = await saveVocabulary(
        username,
        selectedText,
        translated.text,
        translated.ipa || ""
      );
      setMessage("✅ Successfully!");
      setMessageType("success");
      setShowSaveOption(false);
      window.dispatchEvent(new Event("vocabSaved"));
    } catch (error) {
      console.error("Error saving vocabulary:", error);
      setMessage("❌ Failed to save.");
      setMessageType("error");

    }
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };



  const displayText =
    typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text ?? "No text");

  return (
    <div className={`chat-message ${isUser ? "user" : "bot"}`}>
      {message && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            color: messageType === "success" ? "#155724" : "#721c24",
            border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 9999,
            maxWidth: "300px",

          }}
        >
          {message}
        </div>
      )}
      <div className="chat-content">
        <div className="chat-bubble" onMouseUp={handleMouseUp}>
          {displayText}
        </div>
        <TextToSpeech inputText={displayText} />
      </div>

      {(translated.text || translated.ipa) && (
        <div className="chat-translation">
          {translated.text && (
            <div><strong>Bản dịch:</strong> {translated.text}</div>
          )}
          {translated.ipa && (
            <div className="chat-ipa"><em>IPA:</em> {translated.ipa}</div>
          )}
          {showSaveOption && (
            <button className="save-btn" onClick={handleSaveVocabulary}>
              Save Vocabulary
            </button>
          )}
        </div>
      )}
    </div>
  );
}