import React, { useState, useEffect, useRef, useContext } from "react";
import "react-chat-elements/dist/main.css";
import { MessageBox, Input, Button } from "react-chat-elements";
import "./css/Chatbox.css";
import { speechToText } from "../function/speech-to-text";
import { FaMicrophone, FaStop } from "react-icons/fa"; // thư viện icon micro
import TextToSpeech from "../function/text-to-speech";
import { sendMessageToBackend } from "../function/sendMessageToBackend";
import Message from "../class/message.js";
import { UserContext } from "../function/UserContext"; 

function renderMessages(messages) {
  return messages.map((msg, index) => {
    const isUser = msg.user === "user";
    return (
      <div
        key={index}
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
  });
}

function inItRecognition() {
  // Hàm khởi tạo thư viện SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.log("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "vi-VN"; // Đặt ngôn ngữ nhận dạng
  recognition.lang = "en-US"; // Đặt ngôn ngữ nhận diện thành tiếng Anh Mỹ
  recognition.continuous = true; // Nhận dạng đén khi bị dừng
  recognition.interimResults = true; // Không trả về kết quả tạm thời
  return recognition;
}

function speechToTextButton(
  recognitionRef,
  setVoiceButtonStatus,
  isVoiceRecording,
  setInputValue
) {
  if (!recognitionRef.current) {
    // Khởi tại SpeechRecognition nếu chưa được khởi tạo, gọi các hàm định nghĩa lại các function bên trong
    recognitionRef.current = inItRecognition();
    speechToText(
      (tempResult1) => {
        setInputValue(tempResult1);
      },
      (finalResult1) => {
        setInputValue(finalResult1);
      },
      recognitionRef.current
    );
  }

  if (!isVoiceRecording) {
    // Status isVoiceRecording= false => Đang ghi âm
    setInputValue("");
    setVoiceButtonStatus(true);
    recognitionRef.current.start();
  } else {
    setVoiceButtonStatus(false);
    recognitionRef.current.stop();
  }
}

export default function ChatBox() {
  const [messages, setMessage] = useState([]); // Quản lý state của các message
  const [inputValue, setInputValue] = useState(""); // Quản lý state của phần input
  const messageListRef = useRef(null); //Quản lý tham chiếu đến danh sách tin nhắn mà không render lại
  const recognitionRef = useRef(null); //Quản lý ref đến Rec mà không render lại
  const [isVoiceRecording, setVoiceButtonStatus] = useState(false); // Quản lý state của Voice Button
  const [waitForAnswer, setWaitForAnswer] = useState(false); // Quản lý state chờ trả lời của AI
  function setInput(event) {
    setInputValue(event.target.value);
  }
  const { username } = useContext(UserContext); // Get username from context

  async function handleSendButton() {
    if (inputValue.trim() != "") {
      const newUserMessage = new Message();
      newUserMessage.date = new Date();
      newUserMessage.type = "text";
      newUserMessage.position = "right";
      newUserMessage.text = inputValue;
      newUserMessage.user = username;
      newUserMessage.title = username;
      setMessage((messages) => [...messages, newUserMessage]);
      setInputValue(""); // Đặt lại giá trị của input về rỗng
      setWaitForAnswer(true);
      // Call backend & add bot response
      const res = await sendMessageToBackend(inputValue);
      const botText =
        res?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No respond ? Enable backend server first";

      const newBotMessage = new Message();
      newBotMessage.date = new Date();
      newBotMessage.type = "text";
      newBotMessage.position = "left";
      newBotMessage.text = botText;
      newBotMessage.user = "bot";
      newBotMessage.title = "AI agent";

      setMessage((messages) => [...messages, newBotMessage]);
      setWaitForAnswer(false);
      //setInputValue(""); // Đặt lại giá trị của input về rỗng

      // Lưu tin nhắn vào backend
	  try {
	  	const messagesToSave = [newUserMessage, newBotMessage]; // Chỉ lấy 2 tin nhắn mới nhất
	  	await fetch("http://localhost:3000/save-message", {
	  		method: "POST",
	  		headers: {
	  			"Content-Type": "application/json",
	  		},
	  		body: JSON.stringify({ username, messages: messagesToSave }),
	  	});
	  } catch (err) {
	  	console.error("Failed to save messages:", err);
	  }

    }
  }

  // Hàm check index của tin nhắn cuối cùng và scroll down
  function scrollToBottom() {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }

  // Hook check giá trị của mảng message và trigger của hàm scrollToBottom
  useEffect(
    function () {
      scrollToBottom();
    },
    [messages]
  );

  // Lấy history khi username thay đổi
  useEffect(() => {
	async function fetchHistory() {
	  if (!username) return;
	  try {
		const res = await fetch(`http://localhost:3000/get-history/${username}`);
		const data = await res.json();
		if (data?.messages) setMessage(data.messages);
	  } catch (err) {
		console.error("Failed to load history:", err);
	  }
	}
	fetchHistory();
  }, [username]);

  return (
    <div className="chat-container">
      <div className="message-list" ref={messageListRef}>
        {renderMessages(messages)}
      </div>

      <div className="input-container">
        <textarea
          placeholder="Ask anything..."
          type="text"
          value={inputValue}
          onChange={setInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendButton();
            }
          }}
        />
        <div className="button-container">
          {!isVoiceRecording && !waitForAnswer && (
            <Button text="Send" onClick={handleSendButton} />
          )}
          <Button
            text={isVoiceRecording ? <FaStop /> : <FaMicrophone />}
            onClick={() => {
              speechToTextButton(
                recognitionRef,
                setVoiceButtonStatus,
                isVoiceRecording,
                setInputValue
              );
            }}
            className={
              isVoiceRecording ? "btn-voice-disable" : "btn-voice-enable"
            }
          />
        </div>
      </div>
    </div>
  );
}
