import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useSpaces } from '../context/SpaceContext';
import { tweetsApi } from '../services/api';
import { Tweet } from '../types';
import TweetForm from './TweetForm';
import TweetCard from './TweetCard';

interface TweetFeedProps {
  isAllSpaces?: boolean;
  spaceId?: string;
  username?: string;
}

const TweetFeed: React.FC<TweetFeedProps> = ({ isAllSpaces = false, spaceId, username }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentSpace } = useSpaces();

  // Функция для загрузки твитов
  const fetchTweets = async () => {
    try {
      setLoading(true);
      let feedTweets: Tweet[] = [];

      if (username) {
        // Загрузка твитов конкретного пользователя
        feedTweets = await tweetsApi.getUserTweets(username);
      } else if (isAllSpaces) {
        // Загрузка объединенной ленты всех пространств
        feedTweets = await tweetsApi.getUserFeed();
      } else if (spaceId) {
        // Загрузка ленты конкретного пространства
        feedTweets = await tweetsApi.getSpaceFeed(spaceId);
      } else if (currentSpace) {
        // Загрузка ленты текущего пространства
        feedTweets = await tweetsApi.getSpaceFeed(currentSpace.id);
      }

      setTweets(feedTweets);
    } catch (err) {
      console.error('Failed to fetch tweets:', err);
      setError('Не удалось загрузить твиты');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик успешной публикации твита
  const handleTweetSuccess = () => {
    fetchTweets();
  };

  // Загрузка твитов при монтировании или изменении параметров
  useEffect(() => {
    fetchTweets();
  }, [isAllSpaces, spaceId, currentSpace, username]);

  return (
    <FeedContainer>
      {!username && <TweetForm onSuccess={handleTweetSuccess} />}

      {loading ? (
        <LoadingMessage>Загрузка твитов...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : tweets.length === 0 ? (
        <EmptyFeedMessage>
          {username
            ? `У пользователя @${username} нет твитов.`
            : isAllSpaces
              ? 'В ваших пространствах нет твитов. Присоединитесь к большему количеству пространств или создайте новый твит!'
              : 'В этом пространстве нет твитов. Будьте первым, кто создаст твит!'}
        </EmptyFeedMessage>
      ) : (
        <TweetsList>
          {tweets.map(tweet => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </TweetsList>
      )}
    </FeedContainer>
  );
};

const FeedContainer = styled.div`
    padding: 16px;
    border-left: 1px solid #e1e8ed;
    border-right: 1px solid #e1e8ed;
`;

const TweetsList = styled.div`
    margin-top: 16px;
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 24px;
    color: #657786;
`;

const ErrorMessage = styled.div`
    text-align: center;
    padding: 24px;
    color: #e0245e;
`;

const EmptyFeedMessage = styled.div`
    text-align: center;
    padding: 24px;
    color: #657786;
    font-size: 16px;
    line-height: 1.5;
`;

export default TweetFeed; 