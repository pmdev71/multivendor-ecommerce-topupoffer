'use client';

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/lib/socket-client';

interface Message {
  _id?: string;
  senderId: string;
  senderRole: 'customer' | 'seller';
  message: string;
  createdAt: string;
  timestamp?: Date;
  isRead?: boolean;
}

interface ChatProps {
  orderId: string;
  userRole: 'customer' | 'seller';
  userId: string;
}

export default function Chat({ orderId, userRole, userId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get token from cookie or localStorage
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') || 
           document.cookie
             .split('; ')
             .find((row) => row.startsWith('token='))
             ?.split('=')[1] || null;
  };

  const { socket, isConnected } = useSocket(getToken());

  useEffect(() => {
    if (!socket) return;

    // Join chat room
    socket.emit('chat:join', { orderId });

    // Listen for new messages
    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    };

    socket.on('chat:message', handleMessage);

    // Fetch existing messages
    fetchMessages();

    return () => {
      socket.off('chat:message', handleMessage);
    };
  }, [socket, orderId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${orderId}`);
      const data = await res.json();
      if (data.success && data.chat) {
        setMessages(data.chat.messages || []);
      }
    } catch (error) {
      console.error('Messages fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !isConnected) return;

    try {
      // Send message via Socket.IO
      socket.emit('chat:message', {
        orderId,
        message: newMessage.trim(),
      });

      // Also save to database via API
      const res = await fetch(`/api/chat/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await res.json();
      if (data.success) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
          Connecting to chat...
        </div>
      )}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`flex ${
              msg.senderId === userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.senderId === userId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {msg.senderRole === userRole ? 'You' : msg.senderRole}
              </p>
              <p>{msg.message}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

