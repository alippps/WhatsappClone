import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ username, children }) {
  const [socket, setSocket]       = useState(null);
  const [rooms, setRooms]         = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!username) return;

    const s = io('http://localhost:3001');

    s.on('connect', () => {
      setConnected(true);
      s.emit('user:join', { username });
    });

    s.on('disconnect', () => setConnected(false));
    s.on('init',         ({ rooms, onlineUsers }) => { setRooms(rooms); setOnlineUsers(onlineUsers); });
    s.on('rooms:update', (r) => setRooms(r));
    s.on('users:update', (u) => setOnlineUsers(u));

    setSocket(s);
    return () => { s.disconnect(); setSocket(null); setConnected(false); };
  }, [username]);

  return (
    <SocketContext.Provider value={{ socket, rooms, onlineUsers, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
