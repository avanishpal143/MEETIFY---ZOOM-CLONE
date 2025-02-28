import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import { CallUser, PeerConnection } from '../types';

interface SocketContextProps {
  me: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | null;
  call: CallUser | null;
  myVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  peers: PeerConnection[];
  callUser: (id: string) => void;
  answerCall: () => void;
  leaveCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  shareScreen: () => void;
  stopShareScreen: () => void;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  roomId: string | null;
  setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  joinRoom: (roomId: string) => void;
  createRoom: () => void;
}

const SocketContext = createContext<SocketContextProps | null>(null);

// For development, we'll use a mock socket
// In production, you would connect to your actual server
const socket: Socket = io('https://mock-socket-server.com', {
  autoConnect: false,
  transports: ['websocket'],
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [me, setMe] = useState('');
  const [name, setName] = useState('');
  const [call, setCall] = useState<CallUser | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const originalStream = useRef<MediaStream | null>(null);
  const peersRef = useRef<PeerConnection[]>([]);

  useEffect(() => {
    // Check URL for room parameter
    const checkUrlForRoom = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room');
      
      if (roomParam) {
        // Store the room ID but don't join yet (need name first)
        sessionStorage.setItem('pendingRoomId', roomParam);
        
        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('room');
        window.history.replaceState({}, document.title, url.toString());
      }
    };
    
    checkUrlForRoom();
    
    // In a real app, this would connect to your server
    // For demo purposes, we'll simulate socket events
    
    // Simulate getting user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        originalStream.current = currentStream;
        
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    // Simulate socket connection and ID assignment
    setMe(uuidv4());

    // Simulate receiving a call
    const simulateIncomingCall = () => {
      // This would normally come from the socket
      // For demo purposes, we'll just set a timeout
      setTimeout(() => {
        if (Math.random() > 0.7 && !callAccepted && !call) {
          setCall({
            id: uuidv4(),
            name: 'Incoming User',
            signal: {}
          });
        }
      }, 10000);
    };

    simulateIncomingCall();

    return () => {
      // Clean up
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Check for pending room join after name is set
  useEffect(() => {
    if (name) {
      const pendingRoomId = sessionStorage.getItem('pendingRoomId');
      if (pendingRoomId) {
        joinRoom(pendingRoomId);
        sessionStorage.removeItem('pendingRoomId');
      }
    }
  }, [name]);

  const answerCall = () => {
    if (!call) return;
    
    setCallAccepted(true);

    const peer = new Peer({ 
      initiator: false, 
      trickle: false, 
      stream 
    });

    // In a real app, this would handle the signaling
    peer.on('signal', (data) => {
      // socket.emit('answerCall', { signal: data, to: call.id });
      console.log('Answering call with signal', data);
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    // In a real app, this would use the actual signal from the caller
    // peer.signal(call.signal);

    // For demo, we'll simulate a connection
    setTimeout(() => {
      const fakeStream = stream?.clone() || null;
      if (userVideo.current && fakeStream) {
        userVideo.current.srcObject = fakeStream;
      }
    }, 1000);

    // Add to peers
    const peerObj = {
      peerId: call.id,
      peer,
      userName: call.name
    };

    setPeers(prevPeers => [...prevPeers, peerObj]);
    peersRef.current = [...peersRef.current, peerObj];
  };

  const callUser = (id: string) => {
    const peer = new Peer({ 
      initiator: true, 
      trickle: false, 
      stream 
    });

    // In a real app, this would handle the signaling
    peer.on('signal', (data) => {
      // socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
      console.log('Calling user with signal', data);
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    // In a real app, this would listen for the answer
    // socket.on('callAccepted', (signal) => {
    //   peer.signal(signal);
    //   setCallAccepted(true);
    // });

    // For demo, we'll simulate acceptance
    setTimeout(() => {
      setCallAccepted(true);
      const fakeStream = stream?.clone() || null;
      if (userVideo.current && fakeStream) {
        userVideo.current.srcObject = fakeStream;
      }
    }, 2000);

    // Add to peers
    const peerObj = {
      peerId: id,
      peer,
      userName: 'User ' + id.substring(0, 4)
    };

    setPeers(prevPeers => [...prevPeers, peerObj]);
    peersRef.current = [...peersRef.current, peerObj];
  };

  const leaveCall = () => {
    setCallEnded(true);
    
    // Stop all peer connections
    peersRef.current.forEach(({ peer }) => {
      peer.destroy();
    });

    // Reset state
    setPeers([]);
    peersRef.current = [];
    setCallAccepted(false);
    setCall(null);
    
    // In a real app, you would notify other users
    // socket.emit('leaveCall', { roomId });

    // For demo, we'll just reset the state
    setTimeout(() => {
      setCallEnded(false);
    }, 2000);
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const shareScreen = async () => {
    if (!originalStream.current) return;
    
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        cursor: true,
        audio: false
      });
      
      // Replace video track with screen track
      const videoTrack = screenStream.getVideoTracks()[0];
      
      // Replace track in all peer connections
      peersRef.current.forEach(({ peer }) => {
        const sender = peer._senders.find((s: any) => 
          s.track.kind === 'video'
        );
        
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
      
      // Update local video
      if (myVideo.current) {
        const newStream = new MediaStream([
          ...originalStream.current.getAudioTracks(),
          videoTrack
        ]);
        myVideo.current.srcObject = newStream;
        setStream(newStream);
      }
      
      setIsScreenSharing(true);
      
      // Listen for end of screen sharing
      videoTrack.onended = () => {
        stopShareScreen();
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopShareScreen = () => {
    if (!originalStream.current) return;
    
    // Replace screen track with original video track
    const videoTrack = originalStream.current.getVideoTracks()[0];
    
    // Replace track in all peer connections
    peersRef.current.forEach(({ peer }) => {
      const sender = peer._senders.find((s: any) => 
        s.track.kind === 'video'
      );
      
      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
    });
    
    // Update local video
    if (myVideo.current && originalStream.current) {
      myVideo.current.srcObject = originalStream.current;
      setStream(originalStream.current);
    }
    
    setIsScreenSharing(false);
  };

  const createRoom = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    
    // In a real app, you would create a room on the server
    // socket.emit('createRoom', { roomId: newRoomId, userId: me, userName: name });
    
    console.log('Created room with ID:', newRoomId);
    
    // Update URL with room ID (without reloading)
    const url = new URL(window.location.href);
    url.searchParams.set('room', newRoomId);
    window.history.pushState({}, '', url.toString());
    
    // Clean URL after a moment (for better UX)
    setTimeout(() => {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('room');
      window.history.replaceState({}, document.title, cleanUrl.toString());
    }, 1000);
  };

  const joinRoom = (roomIdToJoin: string) => {
    // Extract room ID from full URL if needed
    let extractedRoomId = roomIdToJoin;
    
    if (roomIdToJoin.includes('?room=')) {
      try {
        const url = new URL(roomIdToJoin);
        const roomParam = url.searchParams.get('room');
        if (roomParam) {
          extractedRoomId = roomParam;
        }
      } catch (error) {
        // If not a valid URL, try to extract the room parameter directly
        const match = roomIdToJoin.match(/[?&]room=([^&]+)/);
        if (match && match[1]) {
          extractedRoomId = match[1];
        }
      }
    }
    
    setRoomId(extractedRoomId);
    
    // In a real app, you would join a room on the server
    // socket.emit('joinRoom', { roomId: extractedRoomId, userId: me, userName: name });
    
    console.log('Joined room with ID:', extractedRoomId);
    
    // For demo purposes, simulate other users in the room
    setTimeout(() => {
      // Simulate 1-3 other users joining
      const userCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < userCount; i++) {
        const fakePeerId = uuidv4();
        setTimeout(() => {
          callUser(fakePeerId);
        }, 1000 * (i + 1));
      }
    }, 2000);
  };

  return (
    <SocketContext.Provider value={{
      me,
      name,
      setName,
      callAccepted,
      callEnded,
      stream,
      call,
      myVideo,
      userVideo,
      peers,
      callUser,
      answerCall,
      leaveCall,
      toggleMute,
      toggleVideo,
      shareScreen,
      stopShareScreen,
      isAudioMuted,
      isVideoOff,
      isScreenSharing,
      roomId,
      setRoomId,
      joinRoom,
      createRoom
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};