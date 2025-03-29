import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Space } from '../types';
import { spacesApi } from '../services/api';
import { useSpaces } from '../context/SpaceContext';
import { useUser } from '../context/UserContext';
import { SearchIcon } from './Icons';
import Logo from './Logo';
import AuthButton from './AuthButton';

const RightSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedSpaces, setSuggestedSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const { spaces, joinSpace } = useSpaces();
  const { user } = useUser();

  // Имитация получения рекомендуемых пространств
  // В реальном приложении этот функционал был бы на сервере
  useEffect(() => {
    // Здесь можно было бы получать рекомендации с сервера
    // Пока просто показываем моковые данные
    const mockSuggestedSpaces: Space[] = [
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

    // Фильтруем пространства, в которых пользователь уже состоит
    const existingSpaceIds = spaces.map(s => s.id);
    const filteredSuggestions = mockSuggestedSpaces.filter(
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
      setSuggestedSpaces(suggestedSpaces.filter(s => s.id !== spaceId));
    } catch (err) {
      console.error('Failed to join space:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarContainer>
      <TopSection>
        <LogoWrapper>
          <Logo size="small" showText={false} />
        </LogoWrapper>

        <AuthButtonWrapper>
          <AuthButton isCompact={true} />
        </AuthButtonWrapper>
      </TopSection>

      <SearchContainer>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <SearchInput
          placeholder="Поиск в Xitter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      {/* Если пользователь авторизован, показываем рекомендуемые пространства */}
      {user && (
        <SuggestedSpacesContainer>
          <SectionTitle>Рекомендуемые пространства</SectionTitle>
          {suggestedSpaces.map(space => (
            <SpaceCard key={space.id}>
              <SpaceInfo>
                <SpaceName>{space.name}</SpaceName>
                <SpaceDescription>{space.description}</SpaceDescription>
                <SpaceMembers>{space.members} участников</SpaceMembers>
              </SpaceInfo>
              <JoinButton
                onClick={() => handleJoinSpace(space.id)}
                disabled={loading}
              >
                Присоединиться
              </JoinButton>
            </SpaceCard>
          ))}
        </SuggestedSpacesContainer>
      )}

      <TrendsContainer>
        <SectionTitle>Актуальные темы</SectionTitle>
        <TrendItem>
          <TrendCategory>Технологии</TrendCategory>
          <TrendName>#ReactJS</TrendName>
          <TrendCount>2,543 твитов</TrendCount>
        </TrendItem>
        <TrendItem>
          <TrendCategory>Наука</TrendCategory>
          <TrendName>#КвантовыеВычисления</TrendName>
          <TrendCount>1,256 твитов</TrendCount>
        </TrendItem>
        <TrendItem>
          <TrendCategory>Музыка</TrendCategory>
          <TrendName>#НовыеАльбомы</TrendName>
          <TrendCount>3,789 твитов</TrendCount>
        </TrendItem>
      </TrendsContainer>

      <FooterLinks>
        <FooterLink href="#">О нас</FooterLink>
        <FooterLink href="#">Конфиденциальность</FooterLink>
        <FooterLink href="#">Условия</FooterLink>
        <FooterLink href="#">Помощь</FooterLink>
        <FooterCopyright>© 2025 Xitter</FooterCopyright>
      </FooterLinks>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 350px;
  padding: 0 20px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
`;

const LogoWrapper = styled.div`
  display: flex;
`;

const AuthButtonWrapper = styled.div`
  display: flex;
`;

const SearchContainer = styled.div`
  position: relative;
  margin: 12px 0 20px;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #657786;
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: #ebeef0;
  border: none;
  border-radius: 20px;
  padding: 12px 12px 12px 40px;
  color: #14171a;
  font-size: 15px;
  
  &:focus {
    outline: none;
    background-color: white;
    border: 1px solid #1da1f2;
  }
  
  &::placeholder {
    color: #657786;
  }
`;

const SuggestedSpacesContainer = styled.div`
  background-color: #f7f9fa;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  padding: 12px 16px;
  border-bottom: 1px solid #e1e8ed;
  margin: 0;
`;

const SpaceCard = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #e1e8ed;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SpaceInfo = styled.div`
  flex-grow: 1;
  margin-right: 12px;
  min-width: 0;
`;

const SpaceName = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const SpaceDescription = styled.div`
  font-size: 14px;
  color: #657786;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SpaceMembers = styled.div`
  font-size: 13px;
  color: #657786;
`;

const JoinButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  align-self: center;
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    background-color: #333;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TrendsContainer = styled.div`
  background-color: #f7f9fa;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const TrendItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e1e8ed;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TrendCategory = styled.div`
  font-size: 13px;
  color: #657786;
`;

const TrendName = styled.div`
  font-weight: bold;
  font-size: 15px;
  margin: 4px 0;
`;

const TrendCount = styled.div`
  font-size: 13px;
  color: #657786;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: #657786;
  margin-bottom: 16px;
`;

const FooterLink = styled.a`
  color: #657786;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FooterCopyright = styled.div`
  width: 100%;
  margin-top: 8px;
`;

export default RightSidebar; 