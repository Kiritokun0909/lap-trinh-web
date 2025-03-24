import { useEffect, useState } from 'react';

import './LikeFollowPage.css';
import { getListLikeFollowManga } from '../../api/userApi';
import HandleCode from '../../utils/HandleCode';
import { toast } from 'react-toastify';
import MangaBox from '../../components/site/MangaBox/MangaBox';

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

    fetchMangas();
  }, [keyword, filterCode, pageType]);

  return (
    <div className='like-page__container'>
      <div className='like-page__header'>
        <h2>
          {pageType === 'like' ? 'Danh sách yêu thích' : 'Danh sách theo dõi'}
        </h2>
      </div>

      <div className='list-manga-item'>
        {mangas?.length > 0 &&
          mangas?.map((manga) => (
            <MangaBox key={manga.mangaId} manga={manga} showChapter={true} />
          ))}
      </div>
    </div>
  );
}
