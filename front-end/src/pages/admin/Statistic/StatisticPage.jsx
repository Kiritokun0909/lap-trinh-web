import { useEffect, useState } from 'react';

import {
  getTopGenres,
  getTopMangas,
  getTotalMangaNumber,
  getTotalUserNumber,
} from '../../../api/statisticApi';

import '../ManageGenre/GenrePage.css';
import './StatisticPage.css';

import HandleCode from '../../../utils/HandleCode';
import Pagination from '../../../components/Pagination/Pagination';

const PAGE_TITLE = 'Trang thống kê';
const FILTER_OPTIONS = [
  { value: HandleCode.STATISTIC_NUM_VIEWS_DESC, label: 'Lượt xem cao nhất' },
  { value: HandleCode.STATISTIC_NUM_FOLLOWS_DESC, label: 'Lượt theo dõi cao nhất' },
  { value: HandleCode.STATISTIC_NUM_LIKES_DESC, label: 'Lượt thích nhiều nhất' },
];

export default function StatisticPage() {
  const [totalUserNumber, setTotalUserNumber] = useState(0);
  const [totalMangaNumber, setTotalMangaNumber] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topMangas, setTopMangas] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);

  const [currentPageGenres, setCurrentPageGenres] = useState(1);
  const [totalPagesGenres, setTotalPagesGenres] = useState(1);
  const [topGenres, setTopGenres] = useState([]);
  const [selectedFilterGenres, setSelectedFilterGenres] = useState(FILTER_OPTIONS[0]);

  useEffect(() => {
    document.title = PAGE_TITLE;

    const fetchTotalUserNumber = async () => {
      try {
        const data = await getTotalUserNumber();
        setTotalUserNumber(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchTotalMangaNumber = async () => {
      try {
        const data = await getTotalMangaNumber();
        setTotalMangaNumber(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTotalUserNumber();
    fetchTotalMangaNumber();
  }, []);

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        const response = await getTopMangas(currentPage, 5, selectedFilter);
        setTopMangas(response.items);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTopMangas();
  }, [currentPage, selectedFilter]);

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const response = await getTopGenres(currentPageGenres, 5, selectedFilterGenres);
        setTopGenres(response.items);
        setTotalPagesGenres(response.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTopGenres();
  }, [currentPageGenres, selectedFilterGenres]);

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterGenreChange = (e) => {
    setSelectedFilterGenres(e.target.value);
    setCurrentPageGenres(1);
  };

  const handleResetFilter = () => {
    setSelectedFilter(FILTER_OPTIONS[0]);
    setCurrentPage(1);
  };

  const handleResetFilterGenre = () => {
    setSelectedFilterGenres(FILTER_OPTIONS[0]);
    setCurrentPageGenres(1);
  };

  return (
    <div className='page__container'>
      <div className='page__header'>
        <h1>{PAGE_TITLE}</h1>
      </div>

      <div className='list-info'>
        <div className='card'>
          <div className='card-title'>Tổng số truyện đã đăng</div>
          <div className='card-value'>{totalMangaNumber}</div>
        </div>
        <div className='card'>
          <div className='card-title'>Lượng người dùng</div>
          <div className='card-value'>{totalUserNumber}</div>
        </div>
      </div>

      <div className='top-mangas-container'>
        <div className='table-header-row'>
          <h2 className='table-title'>Top Truyện</h2>
          <div className='filter-controls'>
            <label>Lọc theo:</label>
            <select
              value={selectedFilter}
              onChange={handleFilterChange}
              className='filter-select'
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button onClick={handleResetFilter} className='reset-button'>
              Đặt lại
            </button>
          </div>
        </div>

        <table className='top-mangas-table'>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên truyện</th>
              <th>Lượt xem</th>
              <th>Lượt theo dõi</th>
              <th>Lượt thích</th>
            </tr>
          </thead>
          <tbody>
            {topMangas.map((manga, index) => (
              <tr key={manga.mangaId}>
                <td>{(currentPage - 1) * 5 + index + 1}</td>
                <td>{manga.mangaName}</td>
                <td>{manga.numViews}</td>
                <td>{manga.numFollows}</td>
                <td>{manga.numLikes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <div className='top-mangas-container'>
        <div className='table-header-row'>
          <h2 className='table-title'>Top Thể Loại</h2>
          <div className='filter-controls'>
            <label>Lọc theo:</label>
            <select
              value={selectedFilterGenres}
              onChange={handleFilterGenreChange}
              className='filter-select'
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button onClick={handleResetFilterGenre} className='reset-button'>
              Đặt lại
            </button>
          </div>
        </div>

        <table className='top-mangas-table'>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên thể loại</th>
              <th>Lượt xem</th>
              <th>Lượt theo dõi</th>
              <th>Lượt thích</th>
            </tr>
          </thead>
          <tbody>
            {topGenres.map((genre, index) => (
              <tr key={genre.genreId}>
                <td>{(currentPageGenres - 1) * 5 + index + 1}</td>
                <td>{genre.genreName}</td>
                <td>{genre.totalViews}</td>
                <td>{genre.totalFollows}</td>
                <td>{genre.totalLikes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPageGenres}
          totalPages={totalPagesGenres}
          setCurrentPage={setCurrentPageGenres}
        />
      </div>
    </div>
  );
}
