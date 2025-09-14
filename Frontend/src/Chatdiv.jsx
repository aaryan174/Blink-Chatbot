import './Chatdiv.css';
import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from './MyContext'
import rehypeHighlight from 'rehype-highlight';
import ReactMarkdown from 'react-markdown'
import "highlight.js/styles/github-dark.css";



const Chatdiv = () => {
const {newChat, prevChats, reply} = useContext(MyContext);
const [latestReply, setLatestReply] = useState(null)

useEffect(()=>{
   
  if(!reply){
    setLatestReply(null);
    return;
  }

  if(!prevChats?.length) return;
  const Content = reply.split(" ");
  let idx = 0;
  const interval = setInterval(()=> {
    setLatestReply(Content.slice(0, idx+1).join(" "));
    idx++;
    if(idx >=Content.length) clearInterval(interval);
  },40);

  return () => clearInterval(interval);
},[prevChats, reply])


  return (
    <>
    {newChat && <h1 className='tagline'>Think !! and get Answers in Blink</h1>}
    <div className='chats'>
    {
      prevChats?.slice(0, -1).map((chat, idx)=>
      <div className={chat.Role === "user"?"userDiv": "BlinkDiv"} key={idx}>
        {
          chat.Role === "user"? 
          <p className='userMessage'>{chat.Content}</p>
          : <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.Content}</ReactMarkdown>
        }
      </div>
      )
    }
{/* to print the latest reply */}
    {
      prevChats.length > 0 && latestReply !=null && 
      <div className='BlinkDiv' key={"typing"}>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
      </div>
    }

    {/* print model data without effect in old chats */}
     {
      prevChats.length > 0 && latestReply === null && 
      <div className='BlinkDiv' key={"non-typing"}>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].Content}</ReactMarkdown>
      </div>
    }
    
    </div>
    </>
  )
}

export default Chatdiv

