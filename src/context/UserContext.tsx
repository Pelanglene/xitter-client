import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { usersApi } from '../services/api';

interface UserContextProps {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<User>;
    logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка данных пользователя при инициализации
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                // Попытка загрузить пользователя, только если есть токен авторизации
                if (localStorage.getItem('authToken')) {
                    const userData = await usersApi.getCurrentUser();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError('Не удалось загрузить данные пользователя');
                // При ошибке авторизации удаляем токен
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Авторизация пользователя
    const login = async (username: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            // В реальном приложении здесь был бы запрос к API
            // Пока используем моковые данные

            // Определяем аватарку в зависимости от пользователя
            let avatarPath = '/base192.jpg'; // По умолчанию используем base192.jpg
            if (username.toLowerCase() === 'alice') {
                avatarPath = '/alice192.jpg';
            } else if (username.toLowerCase() === 'ben') {
                avatarPath = '/kapi192.jpg';
            } else if (username.toLowerCase() === 'xitter') {
                avatarPath = '/logo192.png';
            }

            const mockUser: User = {
                id: '1',
                username: username,
                displayName: username.charAt(0).toUpperCase() + username.slice(1),
                avatar: avatarPath, // Установка соответствующей аватарки
                homeSpace: 'xitter-community' // Пространство Xitter community
            };

            // Имитация хранения токена в localStorage
            localStorage.setItem('authToken', 'mock-auth-token');

            setUser(mockUser);
        } catch (err) {
            console.error('Failed to login:', err);
            setError('Неверное имя пользователя или пароль');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Обновление данных пользователя
    const updateUser = async (userData: Partial<User>): Promise<User> => {
        try {
            setLoading(true);
            const updatedUser = await usersApi.updateProfile(userData);
            setUser(updatedUser);
            return updatedUser;
        } catch (err) {
            console.error('Failed to update user data:', err);
            setError('Не удалось обновить данные пользователя');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Выход пользователя
    const logout = () => {
        // Удаляем токен авторизации
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loading, error, login, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Хук для использования контекста пользователя
export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}; 