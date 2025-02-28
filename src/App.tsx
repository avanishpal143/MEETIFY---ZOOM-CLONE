import React, { useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import VideoPlayer from './components/VideoPlayer';
import JoinRoom from './components/JoinRoom';
import Chat from './components/Chat';
import IncomingCall from './components/IncomingCall';
import { useSocket } from './context/SocketContext';
import { MessageSquare, X } from 'lucide-react';

// Wrapper component to use the socket context
const AppContent: React.FC = () => {
  const { roomId } = useSocket();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!roomId) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <JoinRoom />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex">
        {/* Main content */}
        <div className={`flex-1 ${isChatOpen ? 'hidden md:block' : ''}`}>
          <VideoPlayer />
        </div>
        
        {/* Chat sidebar */}
        <div className={`w-full md:w-80 border-l border-gray-200 dark:border-gray-700 ${isChatOpen ? 'block' : 'hidden'}`}>
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium">Chat</h3>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="md:hidden p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Chat />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile chat button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="md:hidden fixed bottom-20 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg"
        >
          <MessageSquare size={24} />
        </button>
      )}
      
      <IncomingCall />
    </div>
  );
};

// Main App component with provider
function App() {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
}

export default App;