import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword } from '../../../api/authApi.js';
import '../LoginPage/LoginPage.css';
import FormInput from '../../../components/FormInput/FormInput.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isForgot, setIsForgot] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Quên mật khẩu';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isForgot) {
        await forgotPassword(email);
        setIsForgot(false);
        toast.success('Mã OTP đã gửi đến email của bạn');
      } else {
        await resetPassword(email, otpCode);
        toast.success('Đã gửi mật khẩu mới đến email của bạn');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page__container'>
      <div className='box__container'>
        <div className='box__container--header'>
          <span>Quên mật khẩu</span>
        </div>
        {loading && (
          <div
            className='loading-indicator'
            style={{ textAlign: 'center', margin: '10px 0' }}
          >
            <span>Đang xử lý...</span>
          </div>
        )}
        <form className='box__container--form' onSubmit={handleSubmit}>
          <FormInput
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!isForgot}
          />
          {!isForgot && (
            <FormInput
              type='text'
              placeholder='Nhập mã OTP'
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
            />
          )}
          <button type='submit' className='submit-btn' disabled={loading}>
            {isForgot ? 'Gửi' : 'Xác nhận'}
          </button>
        </form>
        <div className='other-functions'>
          <div className='switch-btn-container'>
            <Link className='switch-btn' to='/login'>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
