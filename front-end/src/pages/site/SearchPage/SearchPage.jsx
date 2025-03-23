import { useEffect, useState } from 'react';
import './SearchPage.css';
import MangaBox from '../../../components/site/MangaBox/MangaBox';
import { getMangas } from '../../../api/mangaApi';

function SearchMangaResults({ results }) {
  return (
    <div>
      <h2>Kết quả tìm</h2>
      <div className='list-manga-item'>
        {results?.length > 0 &&
          results?.map((manga) => (
            <MangaBox key={manga.mangaId} manga={manga} showChapter={true} />
          ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    document.title = 'Tìm kiếm';
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      const response = await getMangas(1, 10);
      setSearchResults(response.items);
    } catch (error) {
      console.error('Failed to fetch list manga: ', error);
    }
  };

  return (
    <div>
      <SearchMangaResults results={searchResults} />
    </div>
  );
}
