import React from "react";
import { Link } from "react-router-dom";
import "../../styles/component/MangaBox.css";
import { formatDate } from "../../utils/utils";
import { useDarkMode } from "../../context/DarkModeContext.tsx";

export interface MangaBoxProps {
  mangaId: number;
  mangaName: string;
  coverImageUrl: string;
  chapters: [] | undefined;
}

export interface Chapter {
  chapterId: number;
  chapterNumber: number;
  publishedDate: string;
  updateAt: string;
}

export default function MangaBox({
  manga,
  showChapter = false,
}: {
  manga: MangaBoxProps;
  showChapter: boolean;
}) {
  const { darkMode } = useDarkMode();
  const chapters = manga.chapters;

  return (
    <>
      <div
        className={`manga-item ${darkMode ? "dark-mode" : ""}`}
        key={manga.mangaId}
        title={manga.mangaName}
      >
        <Link to={`/manga/${manga.mangaId}`}>
          <img src={manga.coverImageUrl} alt={manga.mangaName} />
          <span>{manga.mangaName}</span>
        </Link>
        <div className="manga-chapter">
          {showChapter &&
            chapters &&
            chapters.map((chapter: Chapter) => (
              <Link
                key={chapter.chapterId}
                to={`/manga/${manga.mangaId}/chapter/${chapter.chapterId}`}
              >
                <div className="chapter-number">
                  <span>Chap {chapter.chapterNumber}</span>
                </div>
                <div className="chapter-time">
                  <span>{formatDate(chapter.updateAt)}</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
