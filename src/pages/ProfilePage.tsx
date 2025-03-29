import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import TweetFeed from '../components/TweetFeed';
import { useUser } from '../context/UserContext';
import { useSpaces } from '../context/SpaceContext';
import { EditIcon, CameraIcon } from '../components/Icons';
import { usersApi } from '../services/api';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user, updateUser } = useUser();
  const { spaces } = useSpaces();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Загрузка данных пользователя из URL или текущего пользователя
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        if (username && username !== user?.username) {
          // Если указан username в URL и он отличается от текущего пользователя
          // Здесь в реальном приложении был бы запрос к API для получения данных пользователя
          // Пока используем моковые данные для Alice и Bob
          let profileData: User | null = null;

          if (username.toLowerCase() === 'alice') {
            profileData = {
              id: 'alice',
              username: 'alice',
              displayName: 'Alice',
              avatar: '/alice192.jpg',
              homeSpace: 'xitter-community'
            };
          } else if (username.toLowerCase() === 'bob') {
            profileData = {
              id: 'bob',
              username: 'bob',
              displayName: 'Bob',
              avatar: '/base192.jpg',
              homeSpace: 'xitter-community'
            };
          } else if (username.toLowerCase() === 'xitter') {
            profileData = {
              id: 'xitter',
              username: 'xitter',
              displayName: 'Xitter',
              avatar: '/logo192.png',
              homeSpace: 'xitter-community'
            };
          } else if (username.toLowerCase() === 'ben') {
            profileData = {
              id: 'ben',
              username: 'ben',
              displayName: 'Ben',
              avatar: '/kapi192.jpg',
              homeSpace: 'xitter-community'
            };
          } else if (username.toLowerCase() === 'carol') {
            profileData = {
              id: 'carol',
              username: 'carol',
              displayName: 'Carol',
              avatar: '/base192.jpg',
              homeSpace: 'xitter-community'
            };
          }

          setProfileUser(profileData);
        } else {
          // Если URL не указан или совпадает с текущим пользователем, показываем профиль текущего пользователя
          setProfileUser(user);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [username, user]);

  // Запуск редактирования профиля
  const startEditing = () => {
    if (profileUser && profileUser.id === user?.id) {
      setEditedName(profileUser.displayName);
      setEditedBio(''); // Предположим, что биография пользователя есть в API
      setIsEditing(true);
    }
  };

  // Сохранение отредактированных данных
  const saveProfile = async () => {
    if (user && profileUser && profileUser.id === user.id) {
      try {
        const updatedUser = await updateUser({
          ...user,
          displayName: editedName
          // Здесь могли бы быть другие поля
        });

        // Обновляем данные в профиле
        setProfileUser(updatedUser);
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update profile:', err);
      }
    }
  };

  // Пользовательские пространства
  const userHomeSpace = spaces.find(space => space.id === profileUser?.homeSpace);

  if (loading) {
    return (
      <PageContainer>
        <Sidebar />
        <MainContent>
          <LoadingContainer>
            Загрузка профиля...
          </LoadingContainer>
        </MainContent>
        <RightSidebar />
      </PageContainer>
    );
  }

  if (!profileUser) {
    return (
      <PageContainer>
        <Sidebar />
        <MainContent>
          <LoadingContainer>
            {username ? `Пользователь @${username} не найден` : 'Авторизуйтесь, чтобы просмотреть профиль'}
          </LoadingContainer>
        </MainContent>
        <RightSidebar />
      </PageContainer>
    );
  }

  const isOwnProfile = user && profileUser.id === user.id;

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <ProfileHeader>
          <ProfileBanner>
            {isOwnProfile && (
              <BannerChangeButton>
                <CameraIcon />
              </BannerChangeButton>
            )}
          </ProfileBanner>

          <ProfileAvatarSection>
            <AvatarWrapper>
              <ProfileAvatar src={profileUser.avatar || 'https://via.placeholder.com/150'} alt={profileUser.username} />
              {isOwnProfile && (
                <AvatarChangeButton>
                  <CameraIcon />
                </AvatarChangeButton>
              )}
            </AvatarWrapper>

            {isOwnProfile && !isEditing ? (
              <EditProfileButton onClick={startEditing}>
                <EditIcon /> Редактировать профиль
              </EditProfileButton>
            ) : isOwnProfile && isEditing ? (
              <SaveProfileButton onClick={saveProfile}>
                Сохранить
              </SaveProfileButton>
            ) : null}
          </ProfileAvatarSection>

          <ProfileInfo>
            {isOwnProfile && isEditing ? (
              <EditableFields>
                <InputField
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Ваше имя"
                />
                <TextArea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="О себе"
                />
              </EditableFields>
            ) : (
              <>
                <ProfileName>{profileUser.displayName}</ProfileName>
                <ProfileHandle>@{profileUser.username}</ProfileHandle>
                <ProfileBio>
                  Пользователь Xitter
                </ProfileBio>
                <ProfileDetails>
                  {userHomeSpace && (
                    <ProfileDetail>
                      🏠 Основное пространство: {userHomeSpace.name}
                    </ProfileDetail>
                  )}
                  <ProfileDetail>
                    📅 Присоединился в {new Date().toLocaleDateString()}
                  </ProfileDetail>
                </ProfileDetails>
                <ProfileStats>
                  <ProfileStat>
                    <StatCount>{spaces.length}</StatCount> пространств
                  </ProfileStat>
                  <ProfileStat>
                    <StatCount>0</StatCount> подписчиков
                  </ProfileStat>
                  <ProfileStat>
                    <StatCount>0</StatCount> подписок
                  </ProfileStat>
                </ProfileStats>
              </>
            )}
          </ProfileInfo>
        </ProfileHeader>

        <ProfileTabs>
          <ProfileTab active>Твиты</ProfileTab>
          <ProfileTab>Медиа</ProfileTab>
          <ProfileTab>Понравившиеся</ProfileTab>
        </ProfileTabs>

        <TweetFeed username={profileUser.username} />
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

const ProfileHeader = styled.div`
  border-bottom: 1px solid #e1e8ed;
`;

const ProfileBanner = styled.div`
  height: 200px;
  background-color: #1da1f2;
  background-image: linear-gradient(to right, #1da1f2, #0d8bd9);
  position: relative;
`;

const BannerChangeButton = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const ProfileAvatarSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-top: -60px;
  align-items: flex-end;
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const ProfileAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  background-color: white;
`;

const AvatarChangeButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const EditProfileButton = styled.button`
  background-color: white;
  color: #1da1f2;
  border: 1px solid #1da1f2;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  height: 36px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
`;

const SaveProfileButton = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    background-color: #1a91da;
  }
`;

const ProfileInfo = styled.div`
  padding: 16px;
`;

const ProfileName = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 4px 0;
`;

const ProfileHandle = styled.div`
  font-size: 16px;
  color: #657786;
  margin-bottom: 12px;
`;

const ProfileBio = styled.p`
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const ProfileDetails = styled.div`
  margin-bottom: 16px;
`;

const ProfileDetail = styled.div`
  font-size: 14px;
  color: #657786;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 16px;
`;

const ProfileStat = styled.div`
  font-size: 14px;
  color: #657786;
`;

const StatCount = styled.span`
  font-weight: bold;
  color: #14171a;
`;

const ProfileTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e8ed;
`;

const ProfileTab = styled.div<{ active?: boolean }>`
  flex: 1;
  padding: 16px;
  text-align: center;
  font-weight: bold;
  color: ${props => props.active ? '#1da1f2' : '#657786'};
  border-bottom: ${props => props.active ? '2px solid #1da1f2' : 'none'};
  cursor: pointer;
  
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
    color: #1da1f2;
  }
`;

const EditableFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputField = styled.input`
  padding: 12px;
  border: 1px solid #e1e8ed;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #1da1f2;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #e1e8ed;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #1da1f2;
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

export default ProfilePage; 