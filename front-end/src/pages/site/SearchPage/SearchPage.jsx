import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GrPowerReset } from 'react-icons/gr';
import { FaSearch } from 'react-icons/fa';

import { getMangas } from '../../../api/mangaApi';
import { getGenres } from '../../../api/genreApi';

import HandleCode from '../../../utils/HandleCode';
import './SearchPage.css';
import MangaList from '../../../components/MangaList/MangaList';
import Pagination from '../../../components/Pagination/Pagination';

const SEARCH_PAGE_TITLE = 'Tìm kiếm';

const filterList = [
  {
    id: HandleCode.FILTER_BY_MANGA_UPDATE_AT_DESC,
    name: 'Mới cập nhật',
  },
  { id: HandleCode.FILTER_BY_MANGA_NUM_VIEWS_DESC, name: 'Xem nhiều nhất' },
  {
    id: HandleCode.FILTER_BY_MANGA_NUM_LIKES_DESC,
    name: 'Lượt yêu thích cao nhất',
  },
  {
    id: HandleCode.FILTER_BY_MANGA_NUM_FOLLOWS_DESC,
    name: 'Lượt theo dõi cao nhất',
  },
];

function SearchInput({
  searchName,
  setSearchName,
  publishedYear,
  setPublishedYear,
  listGenres,
  selectedGenreId,
  setSelectedGenreId,
  listFilters,
  selectedFilterId,
  setSelectedFilterId,
  onSearch,
  onReset,
}) {
  const handleReset = () => {
    onReset();
  };

  return (
    <div className='search-input__container'>
      <input
        className='search-input__item search-input__name'
        type='text'
        placeholder='Tìm kiếm truyện...'
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      <div className='search-input__grid'>
        <div className='search-input__grid-item'>
          <label>Thể loại</label>
          <select
            className='search-input__item'
            value={selectedGenreId}
            onChange={(e) => setSelectedGenreId(e.target.value)}
          >
            <option value='all'>Tất cả</option>
            {listGenres.map((genre) => (
              <option key={genre.genreId} value={genre.genreId}>
                {genre.genreName}
              </option>
            ))}
          </select>
        </div>

        <div className='search-input__grid-item'>
          <label>Năm phát hành</label>
          <input
            className='search-input__item'
            type='number'
            placeholder='Năm phát hành'
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
          />
        </div>

        <div className='search-input__grid-item'>
          <label>Xếp theo</label>
          <select
            className='search-input__item'
            value={selectedFilterId}
            onChange={(e) => setSelectedFilterId(e.target.value)}
          >
            {listFilters.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='search-input__button'>
        <button onClick={handleReset}>
          <div className='btn-icon'>
            <GrPowerReset />
            <span>Reset</span>
          </div>
        </button>
        <button onClick={onSearch}>
          <div className='btn-icon'>
            <FaSearch />
            <span>Tìm kiếm</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);

  const [listGenres, setListGenres] = useState([]);

  const [searchName, setSearchName] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState(
    searchParams.get('genreId') || 'all'
  );
  const [selectedFilterId, setSelectedFilterId] = useState(
    searchParams.get('filterId') || HandleCode.FILTER_BY_MANGA_UPDATE_AT_DESC
  );

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await getGenres();
      setListGenres(data);
    };

    document.title = SEARCH_PAGE_TITLE;
    fetchGenres();

    // Update filters from URL params
    if (searchName === '') setSearchName(searchParams.get('keyword') || '');
    setPublishedYear(searchParams.get('year') || '');
    setSelectedGenreId(searchParams.get('genreId') || 'all');
    setSelectedFilterId(
      searchParams.get('filterId') || HandleCode.FILTER_BY_MANGA_UPDATE_AT_DESC
    );
  }, [searchParams]);

  useEffect(() => {
    fetchMangas();
  }, [currentPage, searchName, selectedFilterId, publishedYear, selectedGenreId]);

  const fetchMangas = async () => {
    try {
      const data = await getMangas(
        currentPage,
        15,
        searchName,
        selectedFilterId,
        publishedYear,
        selectedGenreId === 'all' ? '' : selectedGenreId
      );
      setSearchResults(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch mangas:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMangas();
  };

  const handleReset = () => {
    setSearchName('');
    setPublishedYear('');
    setSelectedGenreId('all');
    setSelectedFilterId(filterList[0].id);
  };

  return (
    <div className='search-page__container'>
      <div className='search-page__header'>
        <h1>Tìm kiếm truyện</h1>
      </div>
      <SearchInput
        searchName={searchName}
        setSearchName={setSearchName}
        publishedYear={publishedYear}
        setPublishedYear={setPublishedYear}
        listGenres={listGenres}
        selectedGenreId={selectedGenreId}
        setSelectedGenreId={setSelectedGenreId}
        listFilters={filterList}
        selectedFilterId={selectedFilterId}
        setSelectedFilterId={setSelectedFilterId}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {searchResults.length > 0 && <MangaList mangas={searchResults} />}

      {searchResults.length === 0 && (
        <div className='search-page__no-result'>
          <h2>Không tìm thấy truyện</h2>
        </div>
      )}

      {searchResults.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
