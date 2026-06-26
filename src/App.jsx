import { useState } from 'react';
import { SocketProvider } from './contexts/SocketContext';
import LoginScreen from './screens/LoginScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('wa-username') || null);
  const [activeRoom, setActiveRoom] = useState(null);

  const handleLogin = (name) => {
    localStorage.setItem('wa-username', name);
    setUsername(name);
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{ background: '#d1d7db' }}
    >
      <div
        className="relative overflow-hidden bg-white shadow-2xl"
        style={{ width: 390, height: 760, borderRadius: 32, border: '8px solid #111' }}
      >
        {!username ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <SocketProvider username={username}>
            {activeRoom ? (
              <ChatRoomScreen
                room={activeRoom}
                username={username}
                onBack={() => setActiveRoom(null)}
              />
            ) : (
              <ChatListScreen
                username={username}
                onOpenRoom={setActiveRoom}
                onLogout={() => { localStorage.removeItem('wa-username'); setUsername(null); }}
              />
            )}
          </SocketProvider>
        )}
      </div>
    </div>
  );
}
