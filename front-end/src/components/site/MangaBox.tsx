import React from "react";
import { Link } from "react-router-dom";
import "../../styles/site/HomePage.css";

export interface MangaBoxProps {
  MangaId: number;
  MangaName: string;
  CoverImageUrl: string;
}

export default function MangaBox({ manga }: { manga: MangaBoxProps }) {
  return (
    <>
      <div className="manga-item" key={manga.MangaId} title={manga.MangaName}>
        <Link to={`/manga/${manga.MangaId}`}>
          <img src={manga.CoverImageUrl} alt={manga.MangaName} />
          <span>{manga.MangaName}</span>
        </Link>
      </div>
    </>
  );
}
