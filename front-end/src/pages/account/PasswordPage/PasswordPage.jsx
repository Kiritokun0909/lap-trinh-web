import { useEffect } from 'react';

const PAGE_TITLE = 'Đổi mật khẩu';

export default function PasswordPage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className='like-page__container'>
      <div className='like-page__header'>
        <h2>Đổi mật khẩu</h2>
      </div>
    </div>
  );
}
