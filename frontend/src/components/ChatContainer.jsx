import React,{useEffect, useRef} from 'react'
import {useChatStore} from "../store/useChatStore.js";
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from "../components/skeletons/MessageSkeleton.jsx"
import { useAuthStore } from '../store/useAuthStore.js';
import { formatMessageTime } from '../lib/utils.js';
const ChatContainer = () => {

  const {message, selectedUser, isMessagesLoading, getMessages, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
  const {authUser} = useAuthStore();

  const msgEnd = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if (message && msgEnd.current) { 
      msgEnd.current.scrollIntoView({behavior:"smooth"}); 
    }
  }, [message])
      
  

  if(isMessagesLoading) return (
      <div className='flex flex-col flex-1 overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )

  return (
    <div className="flex-1 flex flex-col overflow-auto">
    <ChatHeader />

    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {message.map((msg) => (
        <div
          key={msg._id}
          className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          ref={msgEnd}
        >
          <div className=" chat-image avatar">
            <div className="w-10 h-10 rounded-full border">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser.profilePic || "/avatar.png"
                    : selectedUser.profilePic || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
              {formatMessageTime(msg.createdAt)}
            </time>
          </div>
          <div className={`chat-bubble flex flex-col items-center sm:max-w-[300px] `}>
            {msg.image && (
              <img
                src={msg.image}
                alt="Attachment"
                className=" rounded-md mb-2"
              />
            )}
            {msg.text && <p className=''>{msg.text}</p>}
          </div>
        </div>
      ))}
    </div>

    <MessageInput />
  </div>
  )
}

export default ChatContainer
