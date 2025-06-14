import { useState, useRef, useEffect, useContext } from "react";
import { sendMessageToBackend } from "../function/sendMessageToBackend";
import { Button } from "react-chat-elements";
import { sendMessage } from "../services/ChatService";
import { UserContext } from "../function/UserContext";

function speak(
  setisSpeaking,
  isSpeakingRef,
  isOnConversation,
  text,
  callBackFunction
) {
  // Dừng mọi phát âm đang diễn ra
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  setisSpeaking(true);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    setisSpeaking(false);
    if (isOnConversation && !isSpeakingRef.current) {
      callBackFunction();
    }
  };
  speechSynthesis.speak(utterance);
}

export default function AiConversation({ setInputValue, setMessages }) {
  const [isOnConversation, setIsOnConversation] = useState(false);
  const [isSpeaking, setisSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const isOnConversationRef = useRef(isOnConversation);
  const isSpeakingRef = useRef(isSpeaking);
  const { username } = useContext(UserContext); // Get username from context

  useEffect(() => {
    isOnConversationRef.current = isOnConversation;
  }, [isOnConversation]);
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      let finalTranscript = "";
      recognitionRef.current.onresult = async (event) => {
        let tempTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal && !isSpeakingRef.current) {
            finalTranscript += result[0].transcript;
            setInputValue(finalTranscript);
            // Gửi tới Gemini và phát âm trả lời
            const [userMsg, botText] = await sendMessage(
              username,
              finalTranscript
            );
            setMessages((prev) => [...prev, userMsg, botText]);
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
            setInputValue("");
            speak(
              setisSpeaking,
              isSpeakingRef.current,
              isOnConversationRef.current,
              botText.text,
              startListening
            );
          } else {
            tempTranscript = tempTranscript + result[0].transcript;
            setInputValue(tempTranscript);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Recognition error:", event.error);
        setIsOnConversation(false);
        finalTranscript = "";
      };
      recognitionRef.current.onend = (event) => {
        finalTranscript = "";
      };
    }
    setInputValue("");
    recognitionRef.current.start();
  };

  const handleClick = () => {
    if (!isOnConversation) {
      setIsOnConversation(true);
      startListening();
    } else {
      setIsOnConversation(false);
      recognitionRef.current?.stop();
    }
  };

  return (
    <Button
      onClick={handleClick}
      text={isOnConversation ? "Stop" : "Speak to AI"}
    />
  );
}
