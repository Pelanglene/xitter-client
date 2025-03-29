import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Space } from '../types';
import { spacesApi } from '../services/api';
import { useUser } from './UserContext';

interface SpaceContextProps {
    spaces: Space[];
    currentSpace: Space | null;
    loading: boolean;
    error: string | null;
    setCurrentSpace: (spaceId: string) => void;
    refreshSpaces: () => Promise<void>;
    joinSpace: (spaceId: string) => Promise<void>;
}

const SpaceContext = createContext<SpaceContextProps | undefined>(undefined);

// Определяем пространство Xitter community
const xitterCommunitySpace: Space = {
    id: 'xitter-community',
    name: 'Xitter Community',
    description: 'Официальное сообщество пользователей Xitter',
    url: 'https://xitter.example.com/community',
    members: 10543
};

// Определяем пространство Xitter Dev
const xitterDevSpace: Space = {
    id: 'xitter-dev',
    name: 'Xitter Dev',
    description: 'Пространство для разработчиков Xitter',
    url: 'https://xitter.example.com/dev',
    members: 3214
};

export const SpaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [currentSpace, setCurrentSpaceState] = useState<Space | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    // Загрузка списка пространств пользователя
    const refreshSpaces = async () => {
        try {
            setLoading(true);
            // Получаем список пространств пользователя
            const userSpaces = await spacesApi.getUserSpaces();

            // Проверяем, есть ли у пользователя пространство Xitter community
            const hasXitterCommunity = userSpaces.some(space => space.id === 'xitter-community');

            // Проверяем, есть ли у пользователя пространство Xitter Dev
            const hasXitterDev = userSpaces.some(space => space.id === 'xitter-dev');

            // Если пользователь авторизован и у него нет Xitter community, добавляем его
            if (user && !hasXitterCommunity) {
                userSpaces.unshift(xitterCommunitySpace);
            }

            // Если пользователь авторизован и у него нет Xitter Dev, добавляем его
            if (user && !hasXitterDev) {
                userSpaces.push(xitterDevSpace);
            }

            setSpaces(userSpaces);

            // Если есть пространства и нет текущего, установить первое как текущее
            if (userSpaces.length > 0 && !currentSpace) {
                setCurrentSpaceState(userSpaces[0]);
            }
        } catch (err) {
            console.error('Failed to fetch spaces:', err);
            setError('Не удалось загрузить пространства');
        } finally {
            setLoading(false);
        }
    };

    // Установка текущего пространства
    const setCurrentSpace = (spaceId: string) => {
        const space = spaces.find(s => s.id === spaceId);
        if (space) {
            setCurrentSpaceState(space);
        } else {
            console.error(`Space with id ${spaceId} not found`);
        }
    };

    // Присоединение к новому пространству
    const joinSpace = async (spaceId: string) => {
        try {
            setLoading(true);
            await spacesApi.joinSpace(spaceId);
            // Обновляем список пространств после присоединения
            await refreshSpaces();
        } catch (err) {
            console.error('Failed to join space:', err);
            setError('Не удалось присоединиться к пространству');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Инициализация - загрузка пространств при первом рендере или изменении пользователя
    useEffect(() => {
        refreshSpaces();
    }, [user]);

    return (
        <SpaceContext.Provider
            value={{
                spaces,
                currentSpace,
                loading,
                error,
                setCurrentSpace,
                refreshSpaces,
                joinSpace
            }}
        >
            {children}
        </SpaceContext.Provider>
    );
};

// Хук для использования контекста пространств
export const useSpaces = (): SpaceContextProps => {
    const context = useContext(SpaceContext);
    if (context === undefined) {
        throw new Error('useSpaces must be used within a SpaceProvider');
    }
    return context;
}; 