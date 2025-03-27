import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  changeUserEmail,
  changeUserInfo,
  getUserInfo,
  uploadAvatar,
} from '../../../api/userApi';

import FormInput from '../../../components/FormInput/FormInput';

import '../../site/LoginPage/LoginPage.css';
import './AccountPage.css';
import { DEFAULT_AUTHOR_IMAGE_URL } from '../../../utils/utils';

const PAGE_TITLE = 'Thông tin tài khoản';

function AccountForm({ account }) {
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = PAGE_TITLE;
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const data = await getUserInfo();
      setUser(data);
      setAvatar(data.avatar);
      setUsername(data.username);
      setEmail(data.email);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const newUsername = username !== user.username ? username : '';
    const newAvatar = avatar !== user.avatar ? avatar : '';
    const newEmail = email !== user.email ? email : user.email;

    try {
      await changeUserInfo(newUsername, newAvatar);
      toast.success('Cập nhật thông tin thành công');
      await changeUserEmail(newEmail);
      toast.success('Cập nhật email thành công');
    } catch (err) {
      toast.error(err.message);
    }

    fetchInfo();
  };

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
  //   setAvatar(file);
  //   setAvatar(URL.createObjectURL(file));

  // };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);

    try {
      const data = await uploadAvatar(file);
      setAvatar(data.imageUrl);
      toast.success('Tải lên ảnh thành công');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('avatarUpload').click();
  };

  return (
    <div className='box__container'>
      <div className='box__container--header'>
        <span>{PAGE_TITLE}</span>
      </div>

      <form onSubmit={handleSubmitForm} className='box__container--form'>
        {loading ? (
          <div className='loading-spinner'>Đang tải lên...</div>
        ) : (
          <img className='avatar' src={avatar || DEFAULT_AUTHOR_IMAGE_URL} alt='Avatar' />
        )}

        <input
          id='avatarUpload'
          type='file'
          style={{ display: 'none' }}
          accept='image/*'
          onChange={handleImageChange}
        />

        <button type='button' onClick={handleButtonClick} className='change-image'>
          Chọn ảnh
        </button>

        <FormInput
          type='email'
          placeholder='Nhập email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormInput
          type='text'
          placeholder='Nhập username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <button type='submit' className='submit-btn'>
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className='login-page__container'>
      <AccountForm />
    </div>
  );
}
