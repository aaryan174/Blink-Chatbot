import React from 'react'
import SideBar from '../SideBar'
import ChatWindow from '../ChatWindow'
import { MyContext } from '../MyContext'
import { useState } from 'react'
import {v1 as uuidv1} from 'uuid'

const MainApp = () => {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // passing Values
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    sidebarOpen, setSidebarOpen,
  }; 

  return (
    <div className='bg-[#212121] flex'>
      <MyContext.Provider value={providerValues}>
        <SideBar/>
        <ChatWindow/>
      </MyContext.Provider>
    </div>
  )
}

export default MainApp
