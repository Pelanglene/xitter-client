import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Sidebar from '../components/Sidebar';
import TweetFeed from '../components/TweetFeed';
import RightSidebar from '../components/RightSidebar';
import { useSpaces } from '../context/SpaceContext';

const SpacePage: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { spaces, setCurrentSpace } = useSpaces();

  // Устанавливаем текущее пространство при загрузке страницы
  useEffect(() => {
    if (spaceId) {
      setCurrentSpace(spaceId);
    }
  }, [spaceId, setCurrentSpace]);

  // Находим информацию о текущем пространстве
  const currentSpace = spaces.find(s => s.id === spaceId);

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        {currentSpace ? (
          <>
            <SpaceHeader>
              <SpaceBanner />
              <SpaceInfo>
                <SpaceName>{currentSpace.name}</SpaceName>
                <SpaceDescription>{currentSpace.description}</SpaceDescription>
                <SpaceStats>
                  <SpaceStat>{currentSpace.members} участников</SpaceStat>
                  <SpaceStat>
                    <SpaceLink href={currentSpace.url} target="_blank">
                      Перейти
                    </SpaceLink>
                  </SpaceStat>
                </SpaceStats>
              </SpaceInfo>
            </SpaceHeader>
            <TweetFeed spaceId={spaceId} />
          </>
        ) : (
          <LoadingContainer>
            Загрузка пространства...
          </LoadingContainer>
        )}
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

const SpaceHeader = styled.div`
  border-bottom: 1px solid #e1e8ed;
`;

const SpaceBanner = styled.div`
  height: 150px;
  background-color: #1da1f2;
  background-image: linear-gradient(to right, #1da1f2, #0d8bd9);
`;

const SpaceInfo = styled.div`
  padding: 16px;
`;

const SpaceName = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
`;

const SpaceDescription = styled.p`
  color: #657786;
  margin: 0 0 16px 0;
  font-size: 15px;
`;

const SpaceStats = styled.div`
  display: flex;
  gap: 16px;
`;

const SpaceStat = styled.div`
  font-size: 14px;
  color: #657786;
`;

const SpaceLink = styled.a`
  color: #1da1f2;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #657786;
  font-size: 18px;
`;

export default SpacePage; 