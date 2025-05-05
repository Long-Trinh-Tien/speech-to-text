// Currently not used
// but can be used in the future if we want to manage user data in a context
import { useRef, useState } from "react";
import { speechToText } from "../function/speech-to-text";

export default function useSpeechToText(setInputValue) {
  const recognitionRef = useRef(null);
  const [isRecording, setRecording] = useState(false);

  function toggle() {
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.log("Trình duyệt không hỗ trợ nhận dạng giọng nói.");
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      speechToText(
        (temp) => setInputValue(temp),
        (final) => setInputValue(final),
        recognitionRef.current
      );
    }

    if (!isRecording) {
      setInputValue("");
      setRecording(true);
      recognitionRef.current.start();
    } else {
      setRecording(false);
      recognitionRef.current.stop();
    }
  }

  return { toggle, isRecording };
}
