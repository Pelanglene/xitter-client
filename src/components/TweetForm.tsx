import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useSpaces } from '../context/SpaceContext';
import { tweetsApi } from '../services/api';
import { useUser } from '../context/UserContext';
import { ImageIcon, TimesIcon } from './Icons';

interface TweetFormProps {
  onSuccess?: () => void;
}

const TweetForm: React.FC<TweetFormProps> = ({ onSuccess }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSpaceSelector, setShowSpaceSelector] = useState(false);
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);

  const { spaces, currentSpace } = useSpaces();
  const { user } = useUser();

  // При изменении списка пространств пользователя, автоматически добавляем Xitter community
  useEffect(() => {
    const communitySpace = spaces.find(space => space.id === 'xitter-community');
    if (communitySpace && !selectedSpaces.includes('xitter-community')) {
      setSelectedSpaces(['xitter-community']);
    }
  }, [spaces]);

  // Обработка выбора пространства
  const handleSpaceToggle = (spaceId: string) => {
    if (selectedSpaces.includes(spaceId)) {
      setSelectedSpaces(selectedSpaces.filter(id => id !== spaceId));
    } else {
      setSelectedSpaces([...selectedSpaces, spaceId]);
    }
  };

  // Отправка твита
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    if (!user) {
      setError('Необходимо авторизоваться для публикации твита');
      return;
    }

    let spacesToPost = selectedSpaces;

    // Если не выбраны пространства, но есть текущее, публикуем в текущем
    if (spacesToPost.length === 0 && currentSpace) {
      spacesToPost = [currentSpace.id];
    }

    // Если всё ещё нет пространств, пробуем использовать Xitter community
    if (spacesToPost.length === 0) {
      const communitySpace = spaces.find(space => space.id === 'xitter-community');
      if (communitySpace) {
        spacesToPost = ['xitter-community'];
      } else {
        setError('Выберите хотя бы одно пространство для публикации');
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      // Публикуем твит во всех выбранных пространствах
      const promises = spacesToPost.map(spaceId =>
        tweetsApi.createTweet(spaceId, text)
      );

      await Promise.all(promises);
      setText('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to post tweet:', err);
      setError('Не удалось опубликовать твит');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      {user ? (
        <form onSubmit={handleSubmit}>
          <FormHeader>
            <Avatar src={user.avatar || 'https://via.placeholder.com/40'} alt={user.username} />
            <SpaceInfo onClick={() => setShowSpaceSelector(!showSpaceSelector)}>
              {selectedSpaces.length > 0 ? (
                <>
                  <SpaceIndicator>
                    {selectedSpaces.length} {selectedSpaces.length === 1 ? 'пространство' :
                      selectedSpaces.length < 5 ? 'пространства' : 'пространств'}
                  </SpaceIndicator>
                  <SpaceSelector>изменить</SpaceSelector>
                </>
              ) : currentSpace ? (
                <>
                  <SpaceIndicator>{currentSpace.name}</SpaceIndicator>
                  <SpaceSelector>изменить</SpaceSelector>
                </>
              ) : (
                <SpaceSelector>Выбрать пространство</SpaceSelector>
              )}
            </SpaceInfo>
          </FormHeader>

          <TextArea
            placeholder="Что нового?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={280}
          />

          {showSpaceSelector && (
            <SpaceSelectorMenu>
              <SpaceSelectorTitle>Выберите пространства для публикации:</SpaceSelectorTitle>
              {spaces.map(space => (
                <SpaceOption key={space.id}>
                  <SpaceCheckbox
                    type="checkbox"
                    checked={selectedSpaces.includes(space.id)}
                    onChange={() => handleSpaceToggle(space.id)}
                  />
                  <SpaceName>{space.name}</SpaceName>
                </SpaceOption>
              ))}
              <SpaceSelectorActions>
                <CancelButton onClick={() => setShowSpaceSelector(false)}>Отмена</CancelButton>
                <ApplyButton onClick={() => setShowSpaceSelector(false)}>Применить</ApplyButton>
              </SpaceSelectorActions>
            </SpaceSelectorMenu>
          )}

          <FormFooter>
            <FormActions>
              <ActionButton type="button">
                <ImageIcon />
              </ActionButton>
              <CharacterCounter warn={text.length > 250}>
                {text.length}/280
              </CharacterCounter>
            </FormActions>
            <SubmitButton
              type="submit"
              disabled={!text.trim() || submitting}
            >
              {submitting ? 'Отправка...' : 'Твитнуть'}
            </SubmitButton>
          </FormFooter>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      ) : (
        <LoginPrompt>
          Авторизуйтесь, чтобы писать твиты
        </LoginPrompt>
      )}
    </FormContainer>
  );
};

const FormContainer = styled.div`
  background-color: white;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
  object-fit: cover;
`;

const SpaceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const SpaceIndicator = styled.div`
  font-weight: bold;
  color: #1da1f2;
`;

const SpaceSelector = styled.div`
  color: #657786;
  text-decoration: underline;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: none;
  resize: none;
  font-size: 16px;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e1e8ed;
  padding-top: 12px;
`;

const FormActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #1da1f2;
  font-size: 18px;
  cursor: pointer;
  
  &:hover {
    color: #1a91da;
  }
`;

const CharacterCounter = styled.div<{ warn: boolean }>`
  font-size: 14px;
  color: ${props => props.warn ? '#e0245e' : '#657786'};
`;

const SubmitButton = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 8px 16px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  
  &:hover {
    background-color: #1a91da;
  }
  
  &:disabled {
    background-color: #9ad0f5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e0245e;
  margin-top: 12px;
  font-size: 14px;
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 16px;
  color: #657786;
`;

const SpaceSelectorMenu = styled.div`
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  background-color: white;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const SpaceSelectorTitle = styled.div`
  font-weight: bold;
  margin-bottom: 12px;
  color: #14171a;
  font-size: 16px;
`;

const SpaceOption = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
`;

const SpaceCheckbox = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #1da1f2;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  cursor: pointer;
  
  &:checked {
    background-color: #1da1f2;
  }
  
  &:checked::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 0px;
    width: 3px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.2);
  }
`;

const SpaceName = styled.div`
  color: #14171a;
`;

const SpaceSelectorActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e1e8ed;
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid #e1e8ed;
  border-radius: 20px;
  padding: 8px 16px;
  color: #657786;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f8fa;
    border-color: #c4cfd6;
  }
`;

const ApplyButton = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background-color: #1a91da;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(29, 161, 242, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export default TweetForm; 