import { useEffect } from 'react';

const PAGE_TITLE = 'Thông báo';

export default function NotificationPage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className='like-page__container'>
      <div className='like-page__header'>
        <h2>Thông báo</h2>
      </div>
    </div>
  );
}
