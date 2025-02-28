import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Video, Users, Copy, Link } from 'lucide-react';

const JoinRoom: React.FC = () => {
  const { name, setName, roomId, createRoom, joinRoom } = useSocket();
  const [roomIdInput, setRoomIdInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCreateRoom = () => {
    if (!name) return;
    createRoom();
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !roomIdInput) return;
    joinRoom(roomIdInput);
  };

  const copyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyMeetingLink = () => {
    if (!roomId) return;
    const meetingLink = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(meetingLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
          <Video className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MEETIFY</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Start Your Meeting</p>
      </div>

      {roomId ? (
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Your meeting is ready</h2>
            
            {/* Meeting ID */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Meeting ID</p>
              <div className="flex items-center justify-center">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md overflow-hidden overflow-ellipsis">
                  <span className="text-gray-800 dark:text-gray-200">{roomId}</span>
                </div>
                <button 
                  onClick={copyRoomId}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-r-md"
                >
                  {copied ? 'Copied!' : <Copy size={20} />}
                </button>
              </div>
            </div>
            
            {/* Meeting Link */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Meeting Link</p>
              <div className="flex items-center justify-center">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md overflow-hidden overflow-ellipsis">
                  <span className="text-gray-800 dark:text-gray-200 text-sm">
                    {`${window.location.origin.substring(0, 20)}...?room=${roomId.substring(0, 8)}...`}
                  </span>
                </div>
                <button 
                  onClick={copyMeetingLink}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-r-md"
                >
                  {linkCopied ? 'Copied!' : <Link size={20} />}
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Share this meeting ID or link with others you want to meet with
          </p>
          
          <div className="flex justify-center">
            <Users className="h-5 w-5 text-indigo-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              {Math.floor(Math.random() * 3) + 1} participants
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={handleCreateRoom}
              disabled={!name}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create New Meeting
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <form onSubmit={handleJoinRoom}>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Join a Meeting
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="roomId"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter meeting ID or full link"
                  required
                />
                <button
                  type="submit"
                  disabled={!name || !roomIdInput}
                  className="px-4 py-2 bg-gray-800 dark:bg-gray-600 text-white rounded-r-md hover:bg-gray-900 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default JoinRoom;