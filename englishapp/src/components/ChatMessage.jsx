// Aligns the chat message to the left or right based on the user
import { MessageBox } from "react-chat-elements";
import TextToSpeech from "../function/text-to-speech";

export default function ChatMessage({ msg }) {
  const isUser = msg.user !== "bot";

  return (
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
            <TextToSpeech inputText={msg.text} />
          </div>
          <MessageBox {...msg} />
        </>
      ) : (
        <>
          <MessageBox {...msg} />
          <div style={{ flexShrink: 0 }}>
            <TextToSpeech inputText={msg.text} />
          </div>
        </>
      )}
    </div>
  );
}

