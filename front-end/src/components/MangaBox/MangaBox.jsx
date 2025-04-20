import React from 'react';
import { Link } from 'react-router-dom';
import './MangaBox.css';
import { DEFAULT_COVER_IMAGE_URL, formatDate } from '../../utils/utils.js';
import { useDarkMode } from '../../context/DarkModeContext.js';

export default function MangaBox({ manga, showChapter = false, isAdmin = false }) {
  const { darkMode } = useDarkMode();
  const chapters = manga.chapters;

  return (
    <>
      <div
        className={`manga-box__container ${darkMode ? 'dark-mode' : ''}`}
        key={manga.mangaId}
        title={manga.mangaName}
      >
        <Link to={!isAdmin ? `/manga/${manga.mangaId}` : `/admin/manga/${manga.mangaId}`}>
          <img
            src={manga.coverImageUrl || DEFAULT_COVER_IMAGE_URL}
            alt={manga.mangaName}
          />
          <span>{manga.mangaName}</span>
        </Link>
        <div className='manga-box__chapters'>
          {showChapter &&
            chapters &&
            chapters.map((chapter) => (
              <Link key={chapter.chapterId} to={`/chapter/${chapter.chapterId}`}>
                <div className='chapter-number'>
                  <span>Chap {chapter.chapterNumber}</span>
                </div>
                <div className='chapter-time'>
                  <span>{formatDate(chapter.updateAt)}</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
