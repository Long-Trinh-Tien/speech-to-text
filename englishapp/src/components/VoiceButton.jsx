import React from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { Button } from "react-chat-elements";

export default function VoiceButton({ isRecording, toggle }) {
  return (
    <Button
      text={isRecording ? <FaStop /> : <FaMicrophone />}
      onClick={toggle}
      className={isRecording ? "btn-voice-disable" : "btn-voice-enable"}
    />
  );
}
