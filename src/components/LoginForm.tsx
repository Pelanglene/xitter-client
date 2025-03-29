import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useUser } from '../context/UserContext';
import Logo from './Logo';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    try {
      // Сохраняем имя пользователя в localStorage
      localStorage.setItem('username', username.trim());
      await login(username, password);
    } catch (err) {
      // Ошибка обрабатывается в контексте
    }
  };

  return (
    <FormContainer>
      <LogoWrapper>
        <Logo size="large" showText={true} />
      </LogoWrapper>

      <FormTitle>Войти в Xitter</FormTitle>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="username">Имя пользователя</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите имя пользователя"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" disabled={loading || !username.trim() || !password.trim()}>
          {loading ? 'Вход...' : 'Войти'}
        </SubmitButton>
      </Form>

      <HelpLinks>
        <HelpLink href="#">Забыли пароль?</HelpLink>
        <HelpLink href="#">Зарегистрироваться</HelpLink>
      </HelpLinks>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const FormTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #14171a;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #657786;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e1e8ed;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #1da1f2;
    box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #e0245e;
  font-size: 14px;
  text-align: center;
`;

const SubmitButton = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #1a91da;
  }
  
  &:disabled {
    background-color: #9bd9ff;
    cursor: not-allowed;
  }
`;

const HelpLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const HelpLink = styled.a`
  color: #1da1f2;
  font-size: 14px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginForm; 