import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { changeUserPassword } from '../../../api/userApi';

import FormInput from '../../../components/FormInput/FormInput';

import '../../site/LoginPage/LoginPage.css';

const PAGE_TITLE = 'Đổi mật khẩu';

function PasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không trùng khớp');
      return;
    }

    try {
      await changeUserPassword(oldPassword, newPassword);
      toast.success('Đổi mật khẩu thành công');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='box__container'>
      <div className='box__container--header'>
        <span>{PAGE_TITLE}</span>
      </div>

      <form onSubmit={handleSubmitForm} className='box__container--form'>
        <FormInput
          type='password'
          placeholder='Nhập mật khẩu cũ'
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <FormInput
          type='password'
          placeholder='Nhập mật khẩu mới'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <FormInput
          type='password'
          placeholder='Nhập lại mật khẩu mới'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type='submit' className='submit-btn'>
          Đổi mật kháu
        </button>
      </form>
    </div>
  );
}

export default function PasswordPage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className='login-page__container'>
      <PasswordForm />
    </div>
  );
}
