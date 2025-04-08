import React, { useState , useEffect, useRef } from 'react';
import 'react-chat-elements/dist/main.css';
import { MessageBox, Input, Button } from 'react-chat-elements';
import './css/Chatbox.css'
import { speechToText } from '../function/speech-to-text';
import { FaMicrophone, FaStop } from 'react-icons/fa'; // thư viện icon micro

function renderMessages(messages)
{
  return(
    messages.map(
      function(msg,index,arr)
      {
        return(
        <MessageBox key={index} {...msg}/>);
      }
    )
  )
}
function inItRecognition()
{
  // Hàm khởi tạo thư viện SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.log('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.');
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'vi-VN'; // Đặt ngôn ngữ nhận dạng
  recognition.lang = 'en-US'; // Đặt ngôn ngữ nhận diện thành tiếng Anh Mỹ
  recognition.continuous = true; // Nhận dạng đén khi bị dừng
  recognition.interimResults = true; // Không trả về kết quả tạm thời
  return recognition;
}

function speechToTextButton(recognitionRef,setVoiceButtonStatus,isVoiceRecording,setInputValue){
  if(!recognitionRef.current)
  {
    recognitionRef.current = inItRecognition();
  }
  
  if(!isVoiceRecording)
    {
      setInputValue("");
      setVoiceButtonStatus(true);
      speechToText(
      (tempResult1) => {
        setInputValue(tempResult1);
      },
      (finalResult1) => {
        setInputValue(finalResult1);
      }, recognitionRef.current
      )
      recognitionRef.current.start();
    }
  else
  {
    setVoiceButtonStatus(false);
    recognitionRef.current.stop();
  }
}

export default function ChatBox()
{
  const [messages,setMessage] = useState([]); // Quản lý state của các message
  const [inputValue, setInputValue] = useState(""); // Quản lý state của phần input
  const messageListRef = useRef(null); //Quản lý tham chiếu đến danh sách tin nhắn mà không render lại
  const recognitionRef = useRef(null); //Quản lý ref đến Rec mà không render lại
  const [isVoiceRecording, setVoiceButtonStatus] = useState(false); // Quản lý state của Voice Button

  function setInput(event)
  {
    setInputValue(event.target.value);
  }

  function handleSendButton()
  {
    if(inputValue.trim() != "")
    {
      const newMessage = {
        date: new Date(),
        type: "text",
        position: "right",
        text: inputValue,
      };
      setMessage([...messages,newMessage]);
      //setMessage(prevMessages => [...prevMessages, newMessage]);
      setInputValue("");
    }

  }

  // Hàm check index của tin nhắn cuối cùng và scroll down
  function scrollToBottom()
  {
    if(messageListRef.current)
    {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }

  // Hook check giá trị của mảng message và trigger của hàm scrollToBottom
  useEffect(function ()
  {
    scrollToBottom();
  },[messages])

  return(
    <div className="chat-container">
      <div className='message-list' ref={messageListRef}>
        {renderMessages(messages)}
      </div>

      <div className='input-container'>
        <Input 
          placeholder='Ask anything...' 
          type='text'
          value = {inputValue}
          onChange={setInput}
          rightButtons = {
            [!isVoiceRecording && (<Button 
              text="Send"
              onClick={handleSendButton}
            />),
            <Button 
              text={isVoiceRecording ?<FaStop /> :<FaMicrophone /> }
              onClick={() => {speechToTextButton(recognitionRef,setVoiceButtonStatus,isVoiceRecording,setInputValue)}}
              className={isVoiceRecording ? "btn-voice-disable" : "btn-voice-enable"}
            />]
          }
        />
      
      </div>
    </div>
  )
}