import React, { useState , useEffect, useRef } from 'react';
import 'react-chat-elements/dist/main.css';
import { MessageBox, Input, Button } from 'react-chat-elements';
import './css/Chatbox.css'


export default function ChatBox()
{
  const [messages,setMessage] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messageListRef = useRef(null);

  function renderMessages()
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

  function scrollToBottom()
  {
    if(messageListRef.current)
    {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }

  useEffect(function ()
  {
    scrollToBottom();
  },[messages])

  return(
    <div className="chat-container">
      <div className='message-list' ref={messageListRef}>
        {renderMessages()}
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
            />]
          }
        />
      
      </div>
    </div>
  )
}