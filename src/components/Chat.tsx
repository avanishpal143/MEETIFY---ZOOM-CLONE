import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Send } from 'lucide-react';
import { Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Chat: React.FC = () => {
  const { name, me } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate receiving messages
  useEffect(() => {
    const simulateIncomingMessage = () => {
      if (Math.random() > 0.7) {
        const demoMessages = [
          "How's the audio quality?",
          "Can everyone see my screen?",
          "Let's discuss the project timeline",
          "I'll send the documents after the call",
          "Could you speak a bit louder please?",
          "Great presentation!",
          "I need to leave early today"
        ];
        
        const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
        
        const incomingMessage: Message = {
          id: uuidv4(),
          sender: {
            id: 'demo-user',
            name: 'Demo User'
          },
          content: randomMessage,
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, incomingMessage]);
      }
    };
    
    const interval = setInterval(simulateIncomingMessage, 15000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: uuidv4(),
      sender: {
        id: me,
        name: name || 'Me'
      },
      content: newMessage,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // In a real app, you would emit this message to other users
    // socket.emit('message', message);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Chat</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender.id === me ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    message.sender.id === me 
                      ? 'bg-indigo-500 text-white rounded-br-none' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                  }`}
                >
                  {message.sender.id !== me && (
                    <div className="font-semibold text-xs mb-1">
                      {message.sender.name}
                    </div>
                  )}
                  <p>{message.content}</p>
                  <div className="text-xs mt-1 text-right opacity-70">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;