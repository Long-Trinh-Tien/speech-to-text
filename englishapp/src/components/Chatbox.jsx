import React, { useState, useEffect, useRef, useContext } from "react";
import "react-chat-elements/dist/main.css";
import "./css/Chatbox.css";
import { UserContext } from "../function/UserContext"; 
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import useSpeechToText from "../hooks/useSpeechToText";
import { sendMessage, fetchHistory } from "../services/ChatService";

export default function ChatBox() {
  const [messages, setMessages] = useState([]); // Quản lý state của các message
  const [inputValue, setInputValue] = useState(""); // Quản lý state của phần input
  const messageListRef = useRef(null); //Quản lý tham chiếu đến danh sách tin nhắn mà không render lại
  const [waitForAnswer, setWaitForAnswer] = useState(false); // Quản lý state chờ trả lời của AI
  const { username } = useContext(UserContext); // Get username from context
  const { toggle, isRecording } = useSpeechToText(setInputValue);

  async function handleSend() {
    if (!inputValue.trim()) return;
    setWaitForAnswer(true);
    const [userMsg, botMsg] = await sendMessage(username, inputValue);
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputValue("");
    setWaitForAnswer(false);
  }

  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!username) return;
    fetchHistory(username).then(setMessages).catch(console.error);
  }, [username]);

  return (
	<div className="chat-container">
	  <div className="message-list" ref={messageListRef}>
		{messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)}
	  </div>

	  <ChatInput
		inputValue={inputValue}
		setInputValue={setInputValue}
		onSend={handleSend}
		isRecording={isRecording}
		toggleVoice={toggle}
		waitForAnswer={waitForAnswer}
	  />
	</div>
  );
}
