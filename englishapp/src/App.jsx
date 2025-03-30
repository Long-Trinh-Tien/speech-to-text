import { useState } from 'react'
import './App.css'
import ChatBox from './components/Chatbox.jsx'


export default function App() {
  return (
    <>
      <div className='Header'>
        <p>Header</p>
      </div>
      <div className='Chatbox'>
        <ChatBox />
      </div> 
    </>
  )
}

