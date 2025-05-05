import React from "react";
import { Button } from "react-chat-elements";
import VoiceButton from "./VoiceButton";

export default function ChatInput({
  inputValue,
  setInputValue,
  onSend,
  isRecording,
  toggleVoice,
  waitForAnswer
}) {
  return (
    <div className="input-container">
      <textarea
        placeholder="Ask anything..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <div className="button-container">
        {!isRecording && !waitForAnswer && <Button text="Send" onClick={onSend} />}
        <VoiceButton isRecording={isRecording} toggle={toggleVoice} />
      </div>
    </div>
  );
}
