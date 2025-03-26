import MangaBox from '../MangaBox/MangaBox';
import './MangaList.css';

export default function MangaList({ mangas, showChapter = true }) {
  return (
    <div className='manga-list__container'>
      {mangas.map((manga) => (
        <MangaBox key={manga.mangaId} manga={manga} showChapter={showChapter} />
      ))}
    </div>
  );
}
