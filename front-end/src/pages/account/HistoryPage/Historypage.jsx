import { useEffect, useState } from 'react';
import './HistoryPage.css';
import { getUserHistory } from '../../../api/userApi';
import Pagination from '../../../components/Pagination/Pagination';
import { toast } from 'react-toastify';
import MangaList from '../../../components/MangaList/MangaList';

const PAGE_TITLE = 'Lịch sử đọc truyện';

export default function HistoryPage() {
  const [mangas, setMangas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async () => {
    try {
      setMangas([]);
      const response = await getUserHistory(currentPage, 10);
      setMangas(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.title = PAGE_TITLE;
    fetchHistory();
  }, [currentPage]);

  return (
    <div className='like-page__container'>
      <div className='like-page__header'>
        <h2>Lịch sử đọc truyện</h2>
      </div>

      {mangas.length > 0 && <MangaList mangas={mangas} />}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
