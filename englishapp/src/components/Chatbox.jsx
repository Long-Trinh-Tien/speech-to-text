import React, { useState , useEffect, useRef } from 'react';
import 'react-chat-elements/dist/main.css';
import { MessageBox, Input, Button } from 'react-chat-elements';
import './css/Chatbox.css'
import { speechToText } from '../function/speech-to-text';

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



export default function ChatBox()
{
  const [messages,setMessage] = useState([]); // Quản lý state của các message
  const [inputValue, setInputValue] = useState(""); // Quản lý state của phần input
  const messageListRef = useRef(null); //Quản lý state của danh sách tin nhắn
  const [isVoiceButtonDisable, setVoiceButtonStatus] = useState(false); // Quản lý state của Voice Button

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

  function speechToTextButton(){

    //setVoiceButtonStatus(true); // Vô hiệu hóa nút trước khi bắt đầu nhận dạng giọng nói
    speechToText(
      (tempResult1) => {
        setInputValue(tempResult1);
      },
      (finalResult1) => {
        setInputValue(finalResult1);
      }
    )
  }
  // Hàm check giá trị của mảng message và trigger của hàm scrollToBottom
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
            [<Button 
              text="Send"
              onClick={handleSendButton}
            />,
            <Button 
              text="Voice"
              onClick={speechToTextButton}
              disabled={isVoiceButtonDisable}
            />]
          }
        />
      
      </div>
    </div>
  )
}