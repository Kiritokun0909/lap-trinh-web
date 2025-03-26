import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { loginAccount, registerAccount } from '../../../api/authApi';
import { useAuth } from '../../../context/AuthContext';
import HandleCode from '../../../utils/HandleCode';

import './LoginPage.css';
import FormInput from '../../../components/FormInput/FormInput';

const PAGE_TITLE = 'Trang đăng nhập';
const LOGIN_HEADER = 'Đăng nhập';
const REGISTER_HEADER = 'Đăng ký';
const FORGOT_PASSWORD_TEXT = 'Quên mật khẩu?';
const HAVING_ACCOUNT_TEXT = 'Đã có tài khoản? Đăng nhập';
const NOT_HAVING_AN_ACCOUNT_TEXT = 'Chưa có tài khoản? Đăng ký';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { saveCredentials } = useAuth();
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await loginAccount(email, password);
      const { accessToken, roleId } = response;
      saveCredentials(accessToken, roleId);
      toast.success('Đăng nhập thành công');
      if (response.roleId === HandleCode.ROLE_ADMIN) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const register = async () => {
    if (password !== confirmPassword) {
      toast.error('Mật khẩu không trùng khớp');
      return;
    }

    try {
      await registerAccount(email, username, password);
      toast.success(
        'Đăng ký tài khoản thành công! Bạn có thể sử dụng tài khoản vừa đăng ký để đăng nhập.'
      );
      setIsLogin(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    if (isLogin) await login();
    else await register();
  };

  const onForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className='box__container'>
      <div className='box__container--header'>
        <span>{isLogin ? LOGIN_HEADER : REGISTER_HEADER}</span>
      </div>

      <form onSubmit={handleSubmitForm} className='box__container--form'>
        <FormInput
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!isLogin && (
          <FormInput
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <FormInput
          type='password'
          placeholder='Mật khẩu'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <FormInput
            type='password'
            placeholder='Nhập lại mật khẩu'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}

        <button type='submit' className='submit-btn'>
          {isLogin ? LOGIN_HEADER : REGISTER_HEADER}
        </button>
      </form>

      <div className='other-functions'>
        <div className='switch-btn-container'>
          <button className='switch-btn' onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? NOT_HAVING_AN_ACCOUNT_TEXT : HAVING_ACCOUNT_TEXT}
          </button>
        </div>
        {isLogin && (
          <div className='switch-btn-container'>
            <button className='switch-btn' onClick={() => onForgotPassword()}>
              {FORGOT_PASSWORD_TEXT}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const LoginPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className='login-page__container'>
      <LoginForm />
    </div>
  );
};
