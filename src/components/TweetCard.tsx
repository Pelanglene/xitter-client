import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Tweet } from '../types';
import { ReplyIcon, RetweetIcon } from './Icons';
import { formatTimestamp, formatRelativeTime } from '../utils/dateUtils';
import { tweetsApi } from '../services/api';
import { useSpaces } from '../context/SpaceContext';
import { FaHeart, FaShare } from 'react-icons/fa';

interface TweetCardProps {
  tweet: Tweet;
  isReply?: boolean;
}

// Интерфейс для компонента формы ответа
interface ReplyFormProps {
  tweetId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

// Компонент формы ответа на твит
const ReplyForm: React.FC<ReplyFormProps> = ({ tweetId, onCancel, onSuccess }) => {
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentSpace } = useSpaces();

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim() || !currentSpace) {
      return;
    }

    setSubmitting(true);

    try {
      // Отправка ответа через API
      await tweetsApi.replyToTweet(currentSpace.id, tweetId, replyText);
      setReplyText('');
      onSuccess();
    } catch (err) {
      console.error('Failed to submit reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ReplyFormContainer onSubmit={handleSubmitReply}>
      <ReplyTextarea
        placeholder="Напишите ответ..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <ReplyFormActions>
        <CancelButton type="button" onClick={onCancel}>Отмена</CancelButton>
        <SubmitButton
          type="submit"
          disabled={!replyText.trim() || submitting}
        >
          {submitting ? 'Отправка...' : 'Ответить'}
        </SubmitButton>
      </ReplyFormActions>
    </ReplyFormContainer>
  );
};

const TweetCard: React.FC<TweetCardProps> = ({ tweet, isReply = false }) => {
  // Форматирование времени
  const formattedTime = formatTimestamp(tweet.timestamp);

  // Обработчик для перехода на страницу пользователя
  const navigateToUserProfile = () => {
    if (tweet.home) {
      window.open(tweet.home, '_blank', 'noopener,noreferrer');
    }
  };

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <TweetContainer isReply={isReply}>
      <TweetAvatarContainer>
        <TweetAvatar src={tweet.icon} alt={tweet.username} />
      </TweetAvatarContainer>

      <TweetContent>
        <TweetHeader>
          <TweetAuthorName>
            <UserLink to={`/profile/${tweet.username}`}>
              {tweet.username}
            </UserLink>
          </TweetAuthorName>
          <TweetTimestamp>
            {formatRelativeTime(tweet.timestamp)}
          </TweetTimestamp>
        </TweetHeader>

        <TweetText>{tweet.text}</TweetText>

        <TweetActions>
          <TweetAction onClick={toggleReplyForm}>
            <ReplyIcon />
            <ActionCount>{tweet.replies?.length || 0}</ActionCount>
          </TweetAction>
          <TweetAction>
            <RetweetIcon />
            <ActionCount>0</ActionCount>
          </TweetAction>
          <TweetAction onClick={toggleLike}>
            <span className="icon-wrapper">
              <FaHeart color={isLiked ? "#e0245e" : undefined} />
            </span>
            <ActionCount isLiked={isLiked}>{likeCount}</ActionCount>
          </TweetAction>
          <TweetAction>
            <span className="icon-wrapper">
              <FaShare />
            </span>
          </TweetAction>
        </TweetActions>

        {showReplyForm && (
          <ReplyForm onCancel={toggleReplyForm} tweetId={tweet.id} onSuccess={toggleReplyForm} />
        )}

        {tweet.replies && tweet.replies.length > 0 && (
          <RepliesContainer>
            {tweet.replies.map(reply => (
              <TweetCard key={reply.id} tweet={reply} isReply={true} />
            ))}
          </RepliesContainer>
        )}
      </TweetContent>
    </TweetContainer>
  );
};

const TweetContainer = styled.div<{ isReply: boolean }>`
  background-color: white;
  border-radius: ${props => props.isReply ? '0 0 12px 0' : '12px'};
  padding: 16px;
  margin-bottom: ${props => props.isReply ? '0' : '16px'};
  border: 1px solid #e1e8ed;
  display: flex;
  ${props => props.isReply && `
    margin-left: 20px;
    border-left: 2px solid #1da1f2;
  `}
`;

const TweetAvatarContainer = styled.div`
  margin-right: 12px;
  border-radius: 50%;
  overflow: hidden;
  min-width: 48px;
  min-height: 48px;
  width: 48px;
  height: 48px;
`;

const TweetAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;

const TweetContent = styled.div`
  flex-grow: 1;
`;

const TweetHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const TweetAuthorName = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const UserLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
    color: #1da1f2;
  }
`;

const TweetTimestamp = styled.div`
  color: #657786;
  font-size: 14px;
`;

const TweetText = styled.div`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const TweetActions = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
`;

const TweetAction = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #657786;
  
  &:hover {
    color: #1da1f2;
  }
`;

const ActionCount = styled.span<{ isLiked?: boolean }>`
  font-size: 14px;
  margin-left: 5px;
  ${props => props.isLiked && `
    color: #1da1f2;
  `}
`;

const RepliesContainer = styled.div`
  margin-top: 16px;
`;

// Стили для формы ответа
const ReplyFormContainer = styled.form`
  margin-top: 12px;
  border-top: 1px solid #e1e8ed;
  padding-top: 12px;
`;

const ReplyTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 8px;
  resize: none;
  font-size: 14px;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: #1da1f2;
  }
`;

const ReplyFormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid #e1e8ed;
  color: #657786;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #f5f8fa;
  }
`;

const SubmitButton = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #1a91da;
  }
  
  &:disabled {
    background-color: #9ad0f5;
    cursor: not-allowed;
  }
`;

export default TweetCard; 