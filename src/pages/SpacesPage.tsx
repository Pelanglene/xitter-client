import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { Space } from '../types';
import { useSpaces } from '../context/SpaceContext';
import { SearchIcon, HashtagIcon, UsersIcon, ExternalLinkIcon, PlusIcon } from '../components/Icons';

const SpacesPage: React.FC = () => {
  const { spaces, joinSpace } = useSpaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedSpaces, setSuggestedSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);

  // Имитация получения рекомендуемых пространств
  useEffect(() => {
    // Здесь в реальном приложении был бы запрос к API
    const mockSpaces: Space[] = [
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
      },
      {
        id: 'space4',
        name: 'Спорт',
        description: 'Все виды спорта и соревнования',
        url: 'https://xitter.example.com/spaces/sports',
        members: 4210
      },
      {
        id: 'space5',
        name: 'Кулинария',
        description: 'Рецепты, советы и кулинарные истории',
        url: 'https://xitter.example.com/spaces/cooking',
        members: 1876
      }
    ];

    // Фильтруем пространства, в которых пользователь уже состоит
    const existingSpaceIds = spaces.map(s => s.id);
    const filteredSuggestions = mockSpaces.filter(
      s => !existingSpaceIds.includes(s.id)
    );

    setSuggestedSpaces(filteredSuggestions);
  }, [spaces]);

  // Обработчик присоединения к пространству
  const handleJoinSpace = async (spaceId: string) => {
    try {
      setLoading(true);
      await joinSpace(spaceId);

      // Удаляем присоединенное пространство из списка предложений
      setSuggestedSpaces(prev => prev.filter(s => s.id !== spaceId));
    } catch (err) {
      console.error('Failed to join space:', err);
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация пространств по поисковому запросу
  const filteredSpaces = searchQuery.trim()
    ? suggestedSpaces.filter(space =>
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : suggestedSpaces;

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <HeaderTitle>Пространства</HeaderTitle>

          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              placeholder="Поиск пространств"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
        </Header>

        <SpacesSection>
          <SectionTitle>Мои пространства</SectionTitle>

          {spaces.length === 0 ? (
            <EmptyState>
              <EmptyMessage>Вы не присоединились ни к одному пространству</EmptyMessage>
            </EmptyState>
          ) : (
            <SpacesList>
              {spaces.map(space => (
                <SpaceCard key={space.id}>
                  <SpaceIcon>
                    <HashtagIcon />
                  </SpaceIcon>
                  <SpaceInfo>
                    <SpaceName>
                      <Link to={`/spaces/${space.id}`}>{space.name}</Link>
                    </SpaceName>
                    <SpaceDescription>{space.description}</SpaceDescription>
                    <SpaceStats>
                      <SpaceStat>
                        <UsersIcon /> {space.members} участников
                      </SpaceStat>
                      <SpaceStat>
                        <a href={space.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLinkIcon /> Перейти
                        </a>
                      </SpaceStat>
                    </SpaceStats>
                  </SpaceInfo>
                </SpaceCard>
              ))}
            </SpacesList>
          )}
        </SpacesSection>

        <SpacesSection>
          <SectionTitle>Рекомендуемые пространства</SectionTitle>

          {filteredSpaces.length === 0 ? (
            <EmptyState>
              <EmptyMessage>
                {searchQuery ? 'Не найдено пространств по вашему запросу' : 'Нет рекомендаций'}
              </EmptyMessage>
            </EmptyState>
          ) : (
            <SpacesList>
              {filteredSpaces.map(space => (
                <SpaceCard key={space.id}>
                  <SpaceIcon>
                    <HashtagIcon />
                  </SpaceIcon>
                  <SpaceInfo>
                    <SpaceName>{space.name}</SpaceName>
                    <SpaceDescription>{space.description}</SpaceDescription>
                    <SpaceStats>
                      <SpaceStat>
                        <UsersIcon /> {space.members} участников
                      </SpaceStat>
                      <SpaceStat>
                        <a href={space.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLinkIcon /> Перейти
                        </a>
                      </SpaceStat>
                    </SpaceStats>
                  </SpaceInfo>
                  <JoinButton
                    onClick={() => handleJoinSpace(space.id)}
                    disabled={loading}
                  >
                    <PlusIcon /> Присоединиться
                  </JoinButton>
                </SpaceCard>
              ))}
            </SpacesList>
          )}
        </SpacesSection>
      </MainContent>
      <RightSidebar />
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  background-color: white;
`;

const MainContent = styled.main`
  flex-grow: 1;
  min-width: 0;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e1e8ed;
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 10;
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 16px 0;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchIconWrapper = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #657786;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e1e8ed;
  border-radius: 30px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #1da1f2;
  }
`;

const SpacesSection = styled.section`
  padding: 16px;
  border-bottom: 1px solid #e1e8ed;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px 0;
`;

const SpacesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SpaceCard = styled.div`
  display: flex;
  padding: 16px;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
`;

const SpaceIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #1da1f2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
`;

const SpaceInfo = styled.div`
  flex-grow: 1;
`;

const SpaceName = styled.div`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: #1da1f2;
    }
  }
`;

const SpaceDescription = styled.div`
  color: #657786;
  margin-bottom: 8px;
`;

const SpaceStats = styled.div`
  display: flex;
  gap: 16px;
`;

const SpaceStat = styled.div`
  color: #657786;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &:hover {
      color: #1da1f2;
    }
  }
`;

const JoinButton = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  align-self: center;
  
  &:hover {
    background-color: #1a91da;
  }
  
  &:disabled {
    background-color: #9ad0f5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  border: 1px dashed #e1e8ed;
  border-radius: 12px;
`;

const EmptyMessage = styled.div`
  color: #657786;
  font-size: 16px;
`;

export default SpacesPage; 