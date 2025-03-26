import { useEffect } from 'react';

const PAGE_TITLE = 'Quản lý tài khoản';

export default function AccountPage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className='like-page__container'>
      <div className='like-page__header'>
        <h2>Quản lý tài khoản</h2>
      </div>
    </div>
  );
}
