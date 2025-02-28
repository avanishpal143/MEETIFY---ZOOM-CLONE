import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Phone, PhoneOff } from 'lucide-react';

const IncomingCall: React.FC = () => {
  const { call, answerCall, callAccepted } = useSocket();

  if (!call || callAccepted) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Incoming Call
          </h3>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            {call.name} is calling you
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.reload()} // Reject call by refreshing
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <PhoneOff className="mr-2 h-5 w-5" />
            Decline
          </button>
          <button
            onClick={answerCall}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Phone className="mr-2 h-5 w-5" />
            Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;