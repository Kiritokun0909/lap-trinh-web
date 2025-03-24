import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GrPowerReset } from 'react-icons/gr';
import { FaSearch } from 'react-icons/fa';

import { getMangas } from '../../../api/mangaApi';
import { getGenres } from '../../../api/genreApi';

import MangaBox from '../../../components/site/MangaBox/MangaBox';
import './SearchPage.css';

const SEARCH_PAGE_TITLE = 'Tìm kiếm';

const filterList = [
  { id: 1, name: 'Tìm kiếm theo tài khoản' },
  { id: 2, name: 'Tìm kiếm theo truyện' },
  { id: 3, name: 'Tìm kiếm theo thư viện' },
  { id: 4, name: 'Tìm kiếm theo thể loại' },
];

function SearchMangaResults({ results }) {
  return (
    <div>
      <div className='list-manga-item'>
        {results?.length > 0 &&
          results?.map((manga) => (
            <MangaBox key={manga.mangaId} manga={manga} showChapter={true} />
          ))}
      </div>
    </div>
  );
}

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
}) {
  const handleReset = () => {
    setSearchName('');
    setPublishedYear('');
    setSelectedGenreId(listGenres[0].genreId);
    setSelectedFilterId(listFilters[0].id);
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
        <button>
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
  const [searchResults, setSearchResults] = useState([]);

  const [listGenres, setListGenres] = useState([]);

  const [searchName, setSearchName] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [selectedFilterId, setSelectedFilterId] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await getGenres();
      setListGenres(data);
    };

    const fetchMangas = async () => {
      try {
        const response = await getMangas(1, 10);
        setSearchResults(response.items);
      } catch (error) {
        console.error('Failed to fetch mangas:', error);
      }
    };

    // Update title
    document.title = SEARCH_PAGE_TITLE;

    // Fetch genres
    fetchGenres();

    // Update filters from URL params
    setSearchName(searchParams.get('keyword') || '');
    setPublishedYear(searchParams.get('year') || '');
    setSelectedGenreId(searchParams.get('genreId') || '');
    setSelectedFilterId(parseInt(searchParams.get('filterId')) || 1);

    // Fetch mangas
    fetchMangas();
  }, [searchParams]);

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
      />
      <SearchMangaResults results={searchResults} />
    </div>
  );
}
