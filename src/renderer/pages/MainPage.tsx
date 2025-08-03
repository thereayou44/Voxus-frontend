import { useState, useEffect } from 'react';
import { Menu, Search, Hash, Users, Phone, Video, Settings, LogOut, Plus, X, Send, Smile, Paperclip, MoreVertical, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

// Типы
interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
}

interface Room {
  id: string;
  name: string;
  type: 'direct' | 'group';
  members: User[];
  lastMessage?: Message;
  unreadCount?: number;
}

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: User;
}

interface MainPageProps {
  onLogout: () => void;
}

// Компонент статуса пользователя
const UserStatus = ({ status }: { status?: string }) => {
  const statusColors = {
    online: 'bg-status-online',
    idle: 'bg-status-idle',
    dnd: 'bg-status-dnd',
    offline: 'bg-status-offline'
  };

  return (
    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background-secondary ${statusColors[status as keyof typeof statusColors] || statusColors.offline}`} />
  );
};

// Компонент аватара
const Avatar = ({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-accent-pastel-purple to-accent-pastel-blue flex items-center justify-center font-medium`}>
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
        ) : (
          user.username.slice(0, 2).toUpperCase()
        )}
      </div>
      <UserStatus status={user.status} />
    </div>
  );
};

export default function MainPage({ onLogout }: MainPageProps) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    username: 'JohnDoe',
    email: 'john@example.com',
    status: 'online'
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Загрузка данных пользователя
  useEffect(() => {
    loadUserData();
    loadRooms();
  }, []);

  // Загрузка сообщений при выборе комнаты
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  const loadUserData = async () => {
    try {
      const user = await api.getMe();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const roomsData = await api.getMyRooms();
      setRooms(roomsData);
      if (roomsData.length > 0 && !selectedRoom) {
        setSelectedRoom(roomsData[0]);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await api.getRoomMessages(roomId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (messageInput.trim() && selectedRoom) {
      try {
        const newMessage = await api.sendMessage(selectedRoom.id, messageInput);
        setMessages([...messages, newMessage]);
        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
      onLogout();
    }
  };

  return (
    <div className="flex h-screen bg-background-primary text-text-primary">
      {/* Боковая панель серверов */}
      <div className="w-[72px] bg-background-secondary flex flex-col items-center py-3 space-y-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-pastel-purple to-accent-pastel-blue flex items-center justify-center cursor-pointer hover:rounded-2xl transition-all duration-200">
          <Hash className="w-6 h-6" />
        </div>
        <div className="w-10 h-[2px] bg-border rounded-full" />
        <button className="w-12 h-12 rounded-full bg-background-hover flex items-center justify-center hover:bg-accent-primary hover:text-white transition-all duration-200 group">
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Список каналов и пользователей */}
      <div className="w-60 bg-background-secondary flex flex-col">
        {/* Поиск */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Поиск или начать новый чат"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-background-primary rounded-md text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            />
          </div>
        </div>

        {/* Список комнат */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isLoadingRooms ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-accent-pastel-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1 text-xs text-text-muted uppercase font-semibold">
                <span>Чаты</span>
                <Plus className="w-4 h-4 cursor-pointer hover:text-text-primary" />
              </div>
              
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`flex items-center px-2 py-2 rounded-md cursor-pointer transition-all duration-150 group ${
                    selectedRoom?.id === room.id 
                      ? 'bg-background-hover text-text-primary' 
                      : 'hover:bg-background-hover/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="mr-3">
                    {room.type === 'direct' ? (
                      <Avatar user={{ id: '2', username: room.name, email: '' }} size="sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-background-hover flex items-center justify-center">
                        <Hash className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{room.name}</div>
                    {room.lastMessage && (
                      <div className="text-xs text-text-muted truncate">
                        {room.lastMessage.content}
                      </div>
                    )}
                  </div>
                  {room.unreadCount && room.unreadCount > 0 && (
                    <div className="ml-2 px-2 py-0.5 bg-accent-primary text-white text-xs rounded-full">
                      {room.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Панель пользователя */}
        <div className="p-2 border-t border-border">
          <div 
            className="flex items-center p-2 rounded-md hover:bg-background-hover cursor-pointer group relative"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Avatar user={currentUser} size="sm" />
            <div className="flex-1 ml-2 min-w-0">
              <div className="font-medium truncate">{currentUser.username}</div>
              <div className="text-xs text-text-muted">В сети</div>
            </div>
            <Settings className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
          </div>

          {/* Меню пользователя */}
          {showUserMenu && (
            <div className="absolute bottom-16 left-2 right-2 bg-background-primary border border-border rounded-lg shadow-lg p-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-background-hover rounded transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Основная область чата */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Заголовок чата */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-background-secondary">
              <div className="flex items-center">
                {selectedRoom.type === 'direct' ? (
                  <Avatar user={{ id: '2', username: selectedRoom.name, email: '' }} size="sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-background-hover flex items-center justify-center mr-3">
                    <Hash className="w-4 h-4" />
                  </div>
                )}
                <div className="ml-3">
                  <h2 className="font-semibold">{selectedRoom.name}</h2>
                  <p className="text-xs text-text-muted">
                    {selectedRoom.type === 'direct' ? 'В сети' : `${selectedRoom.members.length} участников`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-md hover:bg-background-hover transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-md hover:bg-background-hover transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-md hover:bg-background-hover transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Область сообщений */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-2 border-accent-pastel-purple border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-text-muted mt-8">
                  <p>Начните общение!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex items-start group">
                    <Avatar user={message.user} />
                    <div className="ml-3 flex-1">
                      <div className="flex items-baseline">
                        <span className="font-medium text-text-primary">{message.user.username}</span>
                        <span className="ml-2 text-xs text-text-muted">
                          {new Date(message.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-text-secondary mt-1">{message.content}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 rounded hover:bg-background-hover">
                        <MoreVertical className="w-4 h-4 text-text-muted" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Поле ввода сообщения */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center bg-background-tertiary rounded-lg px-4 py-2">
                <button className="p-1 hover:text-accent-pastel-purple transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Написать сообщение..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 mx-3 bg-transparent outline-none placeholder-text-muted"
                />
                <button className="p-1 hover:text-accent-pastel-yellow transition-colors mr-2">
                  <Smile className="w-5 h-5" />
                </button>
                <button 
                  onClick={sendMessage}
                  className="p-2 bg-accent-primary rounded-md hover:bg-accent-primary/80 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-pastel-purple/20 to-accent-pastel-blue/20 flex items-center justify-center">
                <Hash className="w-16 h-16 text-accent-pastel-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Добро пожаловать в Discord Lite</h3>
              <p className="text-text-secondary">Выберите чат слева или начните новый разговор</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}