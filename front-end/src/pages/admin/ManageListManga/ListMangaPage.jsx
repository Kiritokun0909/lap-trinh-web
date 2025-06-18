import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MdOutlineAdd } from 'react-icons/md';

import { ADMIN_DEFAULT_ITEM_PER_PAGE, DEFAULT_ITEM_PER_PAGE } from '../../../utils/utils';

import { getMangas } from '../../../api/mangaApi';

import MangaList from '../../../components/MangaList/MangaList';
import Pagination from '../../../components/Pagination/Pagination';

import '../ManageGenre/GenrePage.css';
import '../ManageAuthor/AuthorPage.css';
import { useNavigate } from 'react-router-dom';

const PAGE_TITLE = 'Quản lý truyện';

export default function ListMangaPage() {
  const [mangas, setMangas] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const data = await getMangas(currentPage, ADMIN_DEFAULT_ITEM_PER_PAGE, keyword);
        setMangas(data.items);
        setTotalPages(data.totalPages);
      } catch (err) {
        toast.error(err.message);
      }
    };

    document.title = PAGE_TITLE;
    fetchMangas();
  }, [keyword, currentPage]);

  const onclickAddManga = () => {
    navigate('/admin/add-update-manga/0');
  };

  return (
    <div className='page__container'>
      <div className='page__header'>
        <h1>{PAGE_TITLE}</h1>
      </div>

      <div className='page__function'>
        <div className='search-input'>
          <input
            type='text'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Nhập tên truyện muốn tìm...'
            className='search-input'
          />
        </div>
        <button className='function-button add-button' onClick={() => onclickAddManga()}>
          <MdOutlineAdd className='add-button-icon' />
          <span>Thêm</span>
        </button>
      </div>

      <MangaList mangas={mangas} showChapter={false} isAdmin={true} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
