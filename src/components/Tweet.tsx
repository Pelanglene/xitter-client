import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Tweet as TweetType } from '../types';
import { tweetsApi } from '../services/api';
import { useSpaces } from '../context/SpaceContext';
import { ReplyIcon, RetweetIcon, EllipsisHIcon } from './Icons';

interface TweetProps {
  tweet: TweetType;
  showReplies?: boolean;
}

const Tweet: React.FC<TweetProps> = ({ tweet, showReplies = true }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { spaces, currentSpace } = useSpaces();

  const date = new Date(tweet.timestamp * 1000);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  // Обработчик ответа на твит
  const handleReply = async () => {
    if (!replyText.trim() || !currentSpace) return;

    try {
      await tweetsApi.replyToTweet(currentSpace.id, tweet.id, replyText);
      setReplyText('');
      setIsReplying(false);
      // После успешного ответа, здесь должно быть обновление родительского состояния
      // например, обновление ленты твитов
    } catch (err) {
      console.error('Failed to reply:', err);
    }
  };

  // Обработчик перепоста твита в другое пространство
  const handleShare = async (targetSpaceId: string) => {
    if (!currentSpace) return;

    try {
      await tweetsApi.shareToSpace(targetSpaceId, tweet.id, currentSpace.id);
      setShowShareMenu(false);
      // После успешного перепоста, здесь может быть уведомление
    } catch (err) {
      console.error('Failed to share tweet:', err);
    }
  };

  return (
    <TweetContainer>
      <TweetHeader>
        <Avatar src={tweet.icon || 'https://via.placeholder.com/40'} alt={tweet.username} />
        <UserInfo>
          <Username>{tweet.username}</Username>
          <TimeStamp>{formattedDate}</TimeStamp>
        </UserInfo>
        {tweet.home && <HomeLink href={tweet.home} target="_blank">🏠</HomeLink>}
      </TweetHeader>

      <TweetContent>{tweet.text}</TweetContent>

      <TweetActions>
        <ActionButton onClick={() => setIsReplying(!isReplying)}>
          <ReplyIcon /> Ответить
        </ActionButton>
        <ActionButton onClick={() => setShowShareMenu(!showShareMenu)}>
          <RetweetIcon /> Поделиться
        </ActionButton>
        <ActionButton>
          <EllipsisHIcon />
        </ActionButton>
      </TweetActions>

      {isReplying && (
        <ReplyForm>
          <ReplyInput
            placeholder="Написать ответ..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <ReplyButton onClick={handleReply}>Ответить</ReplyButton>
        </ReplyForm>
      )}

      {showShareMenu && (
        <ShareMenu>
          <ShareTitle>Поделиться в пространстве:</ShareTitle>
          {spaces.map(space => (
            <ShareOption
              key={space.id}
              onClick={() => handleShare(space.id)}
            >
              {space.name}
            </ShareOption>
          ))}
        </ShareMenu>
      )}

      {showReplies && tweet.replies && tweet.replies.length > 0 && (
        <RepliesContainer>
          {tweet.replies.map(reply => (
            <Tweet key={reply.id} tweet={reply} showReplies={false} />
          ))}
        </RepliesContainer>
      )}
    </TweetContainer>
  );
};

const TweetContainer = styled.div`
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
`;

const TweetHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex-grow: 1;
`;

const Username = styled.div`
  font-weight: bold;
  color: #14171a;
`;

const TimeStamp = styled.div`
  font-size: 14px;
  color: #657786;
`;

const HomeLink = styled.a`
  text-decoration: none;
  color: #1da1f2;
  margin-left: 8px;
`;

const TweetContent = styled.div`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 12px;
  color: #14171a;
  white-space: pre-wrap;
`;

const TweetActions = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e1e8ed;
  padding-top: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #657786;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    color: #1da1f2;
    background-color: rgba(29, 161, 242, 0.1);
  }
`;

const ReplyForm = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReplyInput = styled.textarea`
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  resize: none;
  min-height: 60px;
`;

const ReplyButton = styled.button`
  align-self: flex-end;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #1a91da;
  }
`;

const RepliesContainer = styled.div`
  margin-top: 16px;
  margin-left: 20px;
  border-left: 2px solid #e1e8ed;
  padding-left: 16px;
`;

const ShareMenu = styled.div`
  margin-top: 8px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  background-color: white;
  padding: 8px;
`;

const ShareTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #14171a;
`;

const ShareOption = styled.div`
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
`;

export default Tweet; 