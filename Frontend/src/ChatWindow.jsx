import React, { useContext, useEffect, useState } from "react";
import Chatdiv from "./Chatdiv";
import "./App.css";
import "./ChatWindow.css";
import { MyContext } from "./MyContext";
import {SyncLoader} from "react-spinners"
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ChatWindow = () => {

  const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, sidebarOpen, setSidebarOpen } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); //set defult at false
  const navigate = useNavigate();

 const getReply = async() => {
  setLoading(true);
  setNewChat(false);
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify( {
      Message: prompt,
      ThreadId: currThreadId
    })
  };

  try {
   const response = await fetch(`${API_BASE_URL}/api/auth/home/chat`, {
     ...options,
     credentials: 'include'
   });
  const res =  await response.json();
  setReply(res.reply);
   console.log(res);
   
  } catch (error) {
    console.log(error);
  }
  setLoading(false);
 }

// Adding new chats to previous chats
useEffect(()=>{
      if(prompt && reply) {
        setPrevChats(prevChats => (
          [...prevChats, {
            Role: "user",
            Content: prompt
          },{
            Role: "Model",
            Content: reply
          }]
        ));
      }

   setPrompt("")   
},[reply])

// prfile click
const handleProfileClick = () => {
  setIsOpen(!isOpen)
}

// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (isOpen && !event.target.closest('.userIconDiv') && !event.target.closest('.dropDown')) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isOpen]);

// Handle mobile sidebar toggle
const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
};

// login btn 
 const goToLogin = () => {
    navigate("/login"); 
  };

// logout btn
const handleLogout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    navigate("/login");
  } catch (error) {
    console.error("Error logging out:", error);
    // Even if logout fails on server, redirect to login
    navigate("/login");
  }
};

  return (
    <div className="chatwindow">
      <div className="navbar">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <span>
          Blink &nbsp; <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="upgrade"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-sm"><path d="M8.11523 3.19409C9.15589 2.15344 10.844 2.15363 11.8848 3.19409L16.8057 8.11499C17.8462 9.15575 17.8463 10.8438 16.8057 11.8845L11.8848 16.8054C10.8441 17.8461 9.156 17.846 8.11523 16.8054L3.19434 11.8845C2.15387 10.8438 2.15369 9.15564 3.19434 8.11499L8.11523 3.19409ZM7.96582 7.49976C7.78889 7.49965 7.6396 7.63263 7.61914 7.80835C7.49243 8.90693 6.87202 9.52734 5.77344 9.65405C5.59772 9.67451 5.46474 9.8238 5.46484 10.0007C5.46517 10.1777 5.59859 10.3264 5.77441 10.3464C6.85731 10.4691 7.52042 11.0831 7.61816 12.1824C7.63414 12.3623 7.78525 12.4999 7.96582 12.4998C8.14634 12.4994 8.29693 12.3613 8.3125 12.1814C8.40645 11.0979 9.06302 10.4414 10.1465 10.3474C10.3264 10.3318 10.4645 10.1813 10.4648 10.0007C10.465 9.82016 10.3273 9.66905 10.1475 9.65308C9.04822 9.55533 8.4342 8.89222 8.31152 7.80933C8.29153 7.6335 8.14276 7.50008 7.96582 7.49976Z" fill="#5856D6"></path></svg>Upgrade Plan</div>

        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {
        isOpen && 
        <div className="dropDown">
        <div className="dropDownItems"> <i className="fa-solid fa-gear"></i> Settings</div>
        <div className="dropDownItems" onClick={goToLogin}> <i className="fa-solid fa-arrow-right-to-bracket"></i> Login</div>
        <div className="dropDownItems" onClick={handleLogout}> <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</div>
        </div>
      }
      <Chatdiv />
      <SyncLoader color="#fff" loading={loading}/>

      <div className="chatInput">
        <div className="InputBox">
          <input type="text" placeholder="Ask Anything" value={prompt} onChange={(e)=>setPrompt(e.target.value)} onKeyDown={(e)=>e.key ==='Enter'? getReply(): ''} />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          Blink can make mistakes. Check important info. See{" "}
          <a href="">
            <u>Cookie Preferences</u>
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
