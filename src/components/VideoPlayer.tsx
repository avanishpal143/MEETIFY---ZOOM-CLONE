import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, Users, MessageSquare, Link } from 'lucide-react';

const VideoPlayer: React.FC = () => {
  const { 
    name, 
    callAccepted, 
    myVideo, 
    userVideo, 
    stream, 
    call, 
    callEnded,
    leaveCall,
    toggleMute,
    toggleVideo,
    shareScreen,
    stopShareScreen,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    peers,
    roomId
  } = useSocket();

  const [linkCopied, setLinkCopied] = React.useState(false);

  const copyMeetingLink = () => {
    if (!roomId) return;
    const meetingLink = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(meetingLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Video className="h-5 w-5 text-indigo-400 mr-2" />
          <span className="text-white font-medium">Zoom Clone</span>
        </div>
        {roomId && (
          <div className="flex items-center">
            <button
              onClick={copyMeetingLink}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded"
            >
              <Link size={16} className="mr-1" />
              {linkCopied ? 'Link Copied!' : 'Copy Meeting Link'}
            </button>
            <div className="ml-2 flex items-center text-gray-300">
              <Users size={16} className="mr-1" />
              <span className="text-sm">{peers.length + 1}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-wrap gap-4 p-4 overflow-auto">
        {/* My Video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg min-w-[320px] min-h-[240px] flex-1">
          <video 
            playsInline 
            muted 
            ref={myVideo} 
            autoPlay 
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
          />
          
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {name.charAt(0).toUpperCase() || 'Me'}
              </div>
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white">
            {name || 'Me'} {isScreenSharing && '(Screen)'}
          </div>
        </div>

        {/* Other User's Video */}
        {callAccepted && !callEnded && (
          <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg min-w-[320px] min-h-[240px] flex-1">
            <video 
              playsInline 
              ref={userVideo} 
              autoPlay 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white">
              {call?.name || 'Caller'}
            </div>
          </div>
        )}

        {/* Peer Videos */}
        {peers.map((peer) => (
          <div key={peer.peerId} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg min-w-[320px] min-h-[240px] flex-1">
            <video 
              playsInline 
              autoPlay 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white">
              {peer.userName}
            </div>
          </div>
        ))}

        {/* Placeholder for empty call */}
        {!callAccepted && !callEnded && peers.length === 0 && (
          <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-lg min-w-[320px] min-h-[240px]">
            <div className="text-center text-white">
              <Users size={48} className="mx-auto mb-4 text-indigo-400" />
              <p className="text-xl font-semibold">Waiting for others to join</p>
              <p className="text-gray-400 mt-2">Share your meeting ID to invite others</p>
              {roomId && (
                <button
                  onClick={copyMeetingLink}
                  className="mt-4 inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                >
                  <Link size={18} className="mr-2" />
                  {linkCopied ? 'Link Copied!' : 'Copy Meeting Link'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 flex items-center justify-center space-x-4">
        <button 
          onClick={toggleMute} 
          className={`p-3 rounded-full ${isAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isAudioMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
        </button>
        
        <button 
          onClick={toggleVideo} 
          className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isVideoOff ? <VideoOff size={20} className="text-white" /> : <Video size={20} className="text-white" />}
        </button>
        
        <button 
          onClick={isScreenSharing ? stopShareScreen : shareScreen} 
          className={`p-3 rounded-full ${isScreenSharing ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          disabled={!stream}
        >
          {isScreenSharing ? 
            <ScreenShare size={20} className="text-white" /> : 
            <ScreenShare size={20} className="text-white" />
          }
        </button>
        
        <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
          <MessageSquare size={20} className="text-white" />
        </button>
        
        <button 
          onClick={leaveCall} 
          className="p-3 rounded-full bg-red-500 hover:bg-red-600"
        >
          <PhoneOff size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;