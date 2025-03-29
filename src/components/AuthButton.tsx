import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useUser } from '../context/UserContext';

interface AuthButtonProps {
    isCompact?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isCompact = false }) => {
    const { user, logout } = useUser();

    if (user) {
        return (
            <Button onClick={logout} isCompact={isCompact}>
                Выйти
            </Button>
        );
    }

    return (
        <StyledLink to="/login" isCompact={isCompact}>
            Войти
        </StyledLink>
    );
};

interface ButtonStyleProps {
    isCompact: boolean;
}

const buttonStyles = (props: ButtonStyleProps) => `
  display: inline-block;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 30px;
  padding: ${props.isCompact ? '8px 12px' : '10px 20px'};
  font-size: ${props.isCompact ? '14px' : '16px'};
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1a91da;
    text-decoration: none;
  }
`;

const Button = styled.button<ButtonStyleProps>`
  ${props => buttonStyles(props)}
`;

const StyledLink = styled(Link) <ButtonStyleProps>`
  ${props => buttonStyles(props)}
  text-decoration: none;
`;

export default AuthButton; 