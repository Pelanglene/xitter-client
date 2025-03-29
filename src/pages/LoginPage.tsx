import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import LoginForm from '../components/LoginForm';
import { useUser } from '../context/UserContext';

// Получаем базовый URL для ресурсов
const PUBLIC_URL = process.env.PUBLIC_URL || '';

const LoginPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <PageContainer>
      <BackgroundLayer />

      <ContentContainer>
        <LeftSection>
          <AppInfo>
            <AppLogo src={`${PUBLIC_URL}/logo512.png`} alt="Xitter Logo" />
            <AppName>Xitter</AppName>
            <AppDescription>Новая социальная платформа с ориентацией на сообщества</AppDescription>
          </AppInfo>
        </LeftSection>

        <RightSection>
          <LoginForm />
        </RightSection>
      </ContentContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1da1f2;
  opacity: 0.1;
  z-index: -1;
`;

const ContentContainer = styled.div`
  display: flex;
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const AppInfo = styled.div`
  text-align: center;
`;

const AppLogo = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
`;

const AppName = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #1da1f2;
  margin-bottom: 16px;
`;

const AppDescription = styled.p`
  font-size: 18px;
  color: #14171a;
  max-width: 400px;
  line-height: 1.5;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export default LoginPage; 