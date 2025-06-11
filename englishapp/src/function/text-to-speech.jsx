import { useSpeech } from "react-text-to-speech";

import { FaCircleStop } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
import { FaCirclePlay } from "react-icons/fa6";

export default function TextToSpeech(props) {
  //Kiểm tra xem trình duyệt có hỗ trợ Web Speech API\
  if (!("speechSynthesis" in window)) {
    console.error("Trình duyệt của bạn không hỗ trợ Web Speech API.");
  }
  const { Text, speechStatus, start, pause, stop } = useSpeech({
    text: props.inputText,
    pitch: 1.5, // Giọng nói sẽ cao hơn một chút
    rate: 0.9, // Giọng nói sẽ chậm hơn một chút so với mặc định
    highlightText: true,
    showOnlyHighlightedText: false,
    highlightMode: "word",
    highlightProps: { style: { color: "yellow", backgroundColor: "white" } },
  });
  return (
    <div className="tts-button-group">
      {speechStatus !== "started" ? (
        <button className="tts-icon" onClick={start} title="Play">
          <FaCirclePlay />
        </button>
      ) : (
        <button className="tts-icon" onClick={pause} title="Pause">
          <FaCirclePause />
        </button>
      )}
      <button className="tts-icon" onClick={stop} title="Stop">
        <FaCircleStop />
      </button>
    </div>
  );
}
