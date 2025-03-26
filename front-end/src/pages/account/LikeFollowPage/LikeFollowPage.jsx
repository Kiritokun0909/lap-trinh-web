import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import HandleCode from '../../../utils/HandleCode';
import { getListLikeFollowManga } from '../../../api/userApi';

import MangaList from '../../../components/MangaList/MangaList';

import './LikeFollowPage.css';

const LIKE_PAGE_TITLE = 'Danh sách yêu thích';
const FOLLOW_PAGE_TITLE = 'Danh sách theo dõi';

export default function LikeFollowPage({ pageType = 'like' }) {
  const [keyword] = useState('');
  const [filterCode] = useState(
    HandleCode.FILTER_BY_USER_LIKE_FOLLOW_DATE_DESC
  );
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const data = await getListLikeFollowManga(
          1,
          10,
          keyword,
          filterCode,
          pageType
        );

        setMangas(data?.items);
      } catch (err) {
        toast.error(err.message);
      }
    };

    document.title = pageType === 'like' ? LIKE_PAGE_TITLE : FOLLOW_PAGE_TITLE;
    fetchMangas();
  }, [keyword, filterCode, pageType]);

  return (
    <div className='like-page__container'>
      <div className='like-page__header'>
        <h2>
          {pageType === 'like' ? 'Danh sách yêu thích' : 'Danh sách theo dõi'}
        </h2>
      </div>

      <MangaList mangas={mangas} />
    </div>
  );
}
