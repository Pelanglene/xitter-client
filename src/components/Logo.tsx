import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
    const getSize = () => {
        switch (size) {
            case 'small': return '24px';
            case 'large': return '48px';
            default: return '32px';
        }
    };

    return (
        <LogoContainer to="/">
            <LogoImage src="/logo192.png" alt="Xitter Logo" size={getSize()} />
            {showText && <LogoText>Xitter</LogoText>}
        </LogoContainer>
    );
};

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
    text-decoration: none;
  }
`;

const LogoImage = styled.img<{ size: string }>`
  width: ${props => props.size};
  height: ${props => props.size};
  margin-right: 10px;
`;

const LogoText = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1da1f2;
`;

export default Logo; 