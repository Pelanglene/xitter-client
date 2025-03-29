import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Sidebar from '../components/Sidebar';
import TweetFeed from '../components/TweetFeed';
import RightSidebar from '../components/RightSidebar';
import { useUser } from '../context/UserContext';

const HomePage: React.FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Перенаправляем на страницу авторизации, если пользователь не авторизован
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Пока проверяем авторизацию, показываем загрузку
  if (loading) {
    return <LoadingContainer>Загрузка...</LoadingContainer>;
  }

  // Если пользователь не авторизован, не рендерим содержимое страницы
  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <TweetFeed isAllSpaces={true} />
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
  min-width: 0; // Для корректного поведения flexbox с переполнением
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #1da1f2;
`;

export default HomePage; 