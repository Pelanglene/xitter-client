import axios from 'axios';
import { Tweet, Space, User } from '../types';

// Базовый URL API сервера
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Инстанс Axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Моковые данные для Xitter Community
const xitterCommunityTweets: Tweet[] = [
  {
    id: 'xitter-1675916490',
    type: 'tweet',
    text: 'Добро пожаловать в Xitter Community! Это официальное пространство для всех пользователей Xitter.',
    username: 'Xitter',
    timestamp: 1675916490,
    icon: '/logo192.png',
    home: 'https://xitter.example.com/community',
    sign: 'c9a5a0d1d1040985e49362aedb75bc9a',
    replies: []
  },
  {
    id: 'alice-1675916590',
    type: 'tweet',
    text: 'Hello World! Я рада присоединиться к сообществу Xitter.',
    username: 'Alice',
    timestamp: 1675916590,
    icon: '/alice192.jpg',
    home: 'https://xitter.example.com/users/alice',
    sign: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    replies: [
      {
        id: 'ben-1675916658',
        type: 'tweet',
        text: 'Привет, Alice! Добро пожаловать в Xitter!',
        username: 'Ben',
        timestamp: 1675916658,
        icon: '/kapi192.jpg',
        home: 'https://xitter.example.com/users/ben'
      }
    ]
  },
  {
    id: 'carol-1675917600',
    type: 'tweet',
    text: 'Делюсь своими мыслями о новой платформе Xitter. Мне нравится концепция пространств!',
    username: 'Carol',
    timestamp: 1675917600,
    icon: '/base192.jpg',
    home: 'https://xitter.example.com/users/carol',
    sign: 'z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4',
    replies: [
      {
        id: 'dave-1675917700',
        type: 'tweet',
        text: 'Согласен, пространства - это отличная идея!',
        username: 'Dave',
        timestamp: 1675917700,
        icon: '/base192.jpg',
        home: 'https://xitter.example.com/users/dave'
      },
      {
        id: 'xitter-1675917800',
        type: 'tweet',
        text: 'Спасибо за отзыв! Мы стараемся сделать Xitter лучше с каждым днем.',
        username: 'Xitter',
        timestamp: 1675917800,
        icon: '/logo192.png',
        home: 'https://xitter.example.com/community'
      }
    ]
  }
];

// API методы для работы с твитами
export const tweetsApi = {
  // Получить твиты из ленты пользователя (объединение твитов из всех пространств)
  getUserFeed: async (): Promise<Tweet[]> => {
    // Имитация запроса к API
    return Promise.resolve(xitterCommunityTweets);
  },
  
  // Получить твиты конкретного пространства
  getSpaceFeed: async (spaceId: string): Promise<Tweet[]> => {
    // Имитация запроса к API
    // В реальном приложении здесь был бы запрос к конкретному пространству
    
    if (spaceId === 'xitter-community') {
      return Promise.resolve(xitterCommunityTweets);
    }
    
    // Для других пространств возвращаем пустой массив
    return Promise.resolve([]);
  },
  
  // Получить твиты конкретного пользователя
  getUserTweets: async (username: string): Promise<Tweet[]> => {
    // Имитация запроса к API
    // В реальном приложении здесь был бы запрос к API для получения твитов пользователя по имени
  
    // Для других пользователей возвращаем пустой массив
    return Promise.resolve(xitterCommunityTweets.filter(tweet => 
      tweet.username.toLowerCase() === username
    ));
  },
  
  // Публикация нового твита
  postTweet: async (tweetData: { text: string, spaceId?: string }): Promise<Tweet> => {
    // Имитация запроса к API
    // В реальном приложении здесь был бы POST-запрос для публикации твита
    
    // Создаем новый твит с моковыми данными
    const username = localStorage.getItem('username') || 'user';
    
    // Определяем аватарку в зависимости от пользователя
    let avatarPath = '/base192.jpg'; // По умолчанию используем base192.jpg
    if (username.toLowerCase() === 'alice') {
      avatarPath = '/alice192.jpg';
    } else if (username.toLowerCase() === 'ben') {
      avatarPath = '/kapi192.jpg';
    } else if (username.toLowerCase() === 'xitter') {
      avatarPath = '/logo192.png';
    }
    
    const newTweet: Tweet = {
      id: `tweet-${Date.now()}`,
      type: 'tweet',
      text: tweetData.text,
      username: username,
      timestamp: Math.floor(Date.now() / 1000),
      icon: avatarPath,
      home: 'https://xitter.example.com/users/user',
      sign: 'mock-signature',
      replies: []
    };
    
    // В реальном приложении твит добавлялся бы на сервере
    // Здесь мы просто возвращаем созданный твит
    return Promise.resolve(newTweet);
  },
  
  // Создать новый твит
  createTweet: async (spaceId: string, text: string): Promise<Tweet> => {
    const response = await apiClient.post(`/spaces/${spaceId}/tweets`, { text });
    return response.data;
  },
  
  // Ответить на твит
  replyToTweet: async (spaceId: string, tweetId: string, text: string): Promise<Tweet> => {
    const response = await apiClient.post(`/spaces/${spaceId}/tweets/${tweetId}/replies`, { text });
    return response.data;
  },
  
  // Поделиться твитом в другом пространстве (ретвит)
  shareToSpace: async (targetSpaceId: string, tweetId: string, sourceSpaceId: string): Promise<Tweet> => {
    const response = await apiClient.post(`/spaces/${targetSpaceId}/share`, { 
      tweetId, 
      sourceSpaceId 
    });
    return response.data;
  }
};

// Мок для пространства Xitter Community
const xitterCommunitySpace: Space = {
  id: 'xitter-community',
  name: 'Xitter Community',
  description: 'Официальное сообщество пользователей Xitter',
  url: 'https://xitter.example.com/community',
  members: 10543
};

// Мок для пространства Xitter Dev
const xitterDevSpace: Space = {
  id: 'xitter-dev',
  name: 'Xitter Dev',
  description: 'Пространство для разработчиков Xitter',
  url: 'https://xitter.example.com/dev',
  members: 3214
};

// Моковые пространства для имитации API
const mockSpaces: Space[] = [
  xitterCommunitySpace,
  xitterDevSpace,
  {
    id: 'space1',
    name: 'Технологии',
    description: 'Обсуждение последних новостей в мире технологий',
    url: 'https://xitter.example.com/spaces/tech',
    members: 5432
  },
  {
    id: 'space2',
    name: 'Искусство',
    description: 'Пространство для творческих людей',
    url: 'https://xitter.example.com/spaces/art',
    members: 2198
  },
  {
    id: 'space3',
    name: 'Наука',
    description: 'Научные открытия и дискуссии',
    url: 'https://xitter.example.com/spaces/science',
    members: 3765
  }
];

// API методы для работы с пространствами
export const spacesApi = {
  // Получить список пространств пользователя
  getUserSpaces: async (): Promise<Space[]> => {
    // Имитация запроса к API
    return Promise.resolve([xitterCommunitySpace, xitterDevSpace]);
  },
  
  // Получить информацию о конкретном пространстве
  getSpaceById: async (spaceId: string): Promise<Space> => {
    const space = mockSpaces.find(s => s.id === spaceId);
    if (space) {
      return Promise.resolve(space);
    }
    throw new Error(`Space with ID ${spaceId} not found`);
  },
  
  // Присоединиться к пространству
  joinSpace: async (spaceId: string): Promise<void> => {
    // Имитация запроса к API для присоединения к пространству
    console.log(`Joined space: ${spaceId}`);
    return Promise.resolve();
  }
};

// API методы для работы с пользователями
export const usersApi = {
  // Получить информацию о текущем пользователе
  getCurrentUser: async (): Promise<User> => {
    // Имитация запроса к API
    // В реальном приложении здесь был бы настоящий запрос с использованием токена
    const storedUsername = localStorage.getItem('username') || 'user';
    
    // Определяем аватарку в зависимости от пользователя
    let avatarPath = '/base192.jpg'; // По умолчанию используем base192.jpg
    if (storedUsername.toLowerCase() === 'alice') {
      avatarPath = '/alice192.jpg';
    } else if (storedUsername.toLowerCase() === 'ben') {
      avatarPath = '/kapi192.jpg';
    } else if (storedUsername.toLowerCase() === 'xitter') {
      avatarPath = '/logo192.png';
    }
    
    return Promise.resolve({
      id: '1',
      username: storedUsername,
      displayName: storedUsername.charAt(0).toUpperCase() + storedUsername.slice(1),
      avatar: avatarPath,
      homeSpace: 'xitter-community'
    });
  },
  
  // Обновить информацию о пользователе
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    // Имитация запроса к API
    // В реальном приложении здесь был бы настоящий запрос для обновления данных
    if (userData.username) {
      localStorage.setItem('username', userData.username);
    }
    
    // Определяем аватарку
    let avatarPath = userData.avatar;
    if (!avatarPath) {
      const storedUsername = userData.username || localStorage.getItem('username') || 'user';
      if (storedUsername.toLowerCase() === 'alice') {
        avatarPath = '/alice192.jpg';
      } else if (storedUsername.toLowerCase() === 'ben') {
        avatarPath = '/kapi192.jpg';
      } else if (storedUsername.toLowerCase() === 'xitter') {
        avatarPath = '/logo192.png';
      } else {
        avatarPath = '/base192.jpg';
      }
    }
    
    return Promise.resolve({
      id: '1',
      username: userData.username || 'user',
      displayName: userData.displayName || 'User',
      avatar: avatarPath,
      homeSpace: userData.homeSpace || 'xitter-community'
    });
  }
};

export default {
  tweets: tweetsApi,
  spaces: spacesApi,
  users: usersApi
}; 