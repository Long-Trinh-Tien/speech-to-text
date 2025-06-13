import { useState } from "react";
import { MessageBox } from "react-chat-elements";
import TextToSpeech from "../function/text-to-speech";
import { translateText } from "../services/ChatService";



export default function ChatMessage({ msg }) {
  const [translated, setTranslated] = useState({ text: "", ipa: "" });
  const isUser = msg.user !== "bot";

  const handleMouseUp = async () => {
    const selectedText = window.getSelection().toString().trim();
    const originalText = typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text);

    if (!selectedText || !originalText.includes(selectedText)) return;

    const result = await translateText(selectedText);


    setTranslated({
      text: result.text?.replace(/\n/g, "") || "Can not translate.",
      ipa: result.ipa?.replace(/\n/g, "") || "",
    });
  };

  const displayText =
    typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text ?? "No text");

  return (
    <div className={`chat-message ${isUser ? "user" : "bot"}`}>
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
        </div>
      )}
    </div>
  );
}