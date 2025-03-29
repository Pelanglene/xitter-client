import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import { UserProvider } from './context/UserContext';
import { SpaceProvider } from './context/SpaceContext';
import HomePage from './pages/HomePage';
import SpacePage from './pages/SpacePage';
import ProfilePage from './pages/ProfilePage';
import SpacesPage from './pages/SpacesPage';
import LoginPage from './pages/LoginPage';

// Получаем базовый путь для GitHub Pages из переменной PUBLIC_URL
// Во время разработки будет пустая строка, при деплое на GitHub Pages - правильный путь
const basename = process.env.PUBLIC_URL || '';

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <SpaceProvider>
          <Global
            styles={css`
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f5f8fa;
                color: #14171a;
                line-height: 1.3;
              }
              
              a {
                color: #1da1f2;
                text-decoration: none;
                
                &:hover {
                  text-decoration: underline;
                }
              }
            `}
          />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/spaces" element={<SpacesPage />} />
            <Route path="/spaces/:spaceId" element={<SpacePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            {/* Здесь могут быть другие маршруты */}
          </Routes>
        </SpaceProvider>
      </UserProvider>
    </Router>
  );
};

export default App; 