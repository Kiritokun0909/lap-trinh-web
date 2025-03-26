import { useEffect } from 'react';
import './HistoryPage.css';

const PAGE_TITLE = 'Lịch sử đọc truyện';

export default function HistoryPage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className='like-page__container'>
      <div className='like-page__header'>
        <h2>Lịch sử đọc truyện</h2>
      </div>
    </div>
  );
}
