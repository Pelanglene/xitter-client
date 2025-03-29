import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { useUser } from '../context/UserContext';
import { useSpaces } from '../context/SpaceContext';
import { HomeIcon, SearchIcon, BellIcon, EnvelopeIcon, BookmarkIcon, UserIcon, HashtagIcon } from './Icons';
import Logo from './Logo';

const Sidebar: React.FC = () => {
  const { user, logout } = useUser();
  const { spaces } = useSpaces();

  return (
    <SidebarContainer>
      <LogoWrapper>
        <Logo size="medium" showText={true} />
      </LogoWrapper>

      <MainNav>
        <NavItem to="/" end>
          <HomeIcon /> <span>Главная</span>
        </NavItem>
        <NavItem to="/explore">
          <SearchIcon /> <span>Поиск</span>
        </NavItem>
        <NavItem to="/notifications">
          <BellIcon /> <span>Уведомления</span>
        </NavItem>
        <NavItem to="/messages">
          <EnvelopeIcon /> <span>Сообщения</span>
        </NavItem>
        <NavItem to="/bookmarks">
          <BookmarkIcon /> <span>Закладки</span>
        </NavItem>
        <NavItem to="/profile">
          <UserIcon /> <span>Профиль</span>
        </NavItem>
      </MainNav>

      <SpacesSection>
        <SectionTitle>Мои пространства</SectionTitle>
        {spaces.map(space => (
          <NavItem key={space.id} to={`/spaces/${space.id}`}>
            <HashtagIcon /> <span>{space.name}</span>
          </NavItem>
        ))}
        <NavItem to="/spaces" className="more-spaces">
          <span>Показать все пространства</span>
        </NavItem>
      </SpacesSection>

      <TweetButton to="/compose">
        Твитнуть
      </TweetButton>

      {user && (
        <UserInfo>
          <Avatar src={user.avatar || 'https://via.placeholder.com/40'} alt={user.username} />
          <UserDetails>
            <UserName>{user.displayName}</UserName>
            <UserHandle>@{user.username}</UserHandle>
          </UserDetails>
          <LogoutButton onClick={logout}>Выйти</LogoutButton>
        </UserInfo>
      )}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 275px;
  height: 100vh;
  border-right: 1px solid #e1e8ed;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
`;

const LogoWrapper = styled.div`
  padding-left: 12px;
  margin-bottom: 24px;
`;

const MainNav = styled.nav`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 24px;
  color: #14171a;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s;
  
  span {
    margin-left: 16px;
  }
  
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
    color: #1da1f2;
  }
  
  &.active {
    color: #1da1f2;
  }
  
  &.more-spaces {
    color: #1da1f2;
    font-size: 14px;
    padding: 8px 12px;
  }
`;

const SpacesSection = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  padding-left: 12px;
`;

const TweetButton = styled(NavLink)`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
  text-align: center;
  text-decoration: none;
  
  &:hover {
    background-color: #1a91da;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 24px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div`
  margin-left: 12px;
  flex-grow: 1;
`;

const UserName = styled.div`
  font-weight: bold;
  color: #14171a;
`;

const UserHandle = styled.div`
  font-size: 14px;
  color: #657786;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #e0245e;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Sidebar; 