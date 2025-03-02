import React, { useEffect, useState } from "react";
import { getMangas } from "../../api/mangaApi";
import "../../styles/site/HomePage.css";
import MangaBox, { MangaBoxProps } from "../../components/site/MangaBox.tsx";

export default function HomePage() {
  const [topMangas, setTopMangas] = useState([]);
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    fetchTopMangas();
    fetchMangas();
  }, []);

  const fetchTopMangas = async () => {
    try {
      const response = await getMangas(1, 20);
      // console.log("Manga list: ", response);
      setTopMangas(response.items);
    } catch (error) {
      console.error("Failed to fetch list manga: ", error);
    }
  };

  const fetchMangas = async () => {
    try {
      const response = await getMangas(1, 20);
      // console.log("Manga list: ", response);
      setMangas(response.items);
    } catch (error) {
      console.error("Failed to fetch list manga: ", error);
    }
  };

  return (
    <>
      <div className="list-manga">
        <h2>Top Manga</h2>
        <div className="slideshow-container">
          <div className="slide-wrapper">
            {topMangas.map((manga: MangaBoxProps) => (
              <MangaBox key={manga.MangaId} manga={manga} />
            ))}
          </div>
        </div>
      </div>
      <div className="list-manga">
        <h2>Newest Manga</h2>
        <div className="list-manga-item">
          {mangas.map((manga: MangaBoxProps) => (
            <MangaBox key={manga.MangaId} manga={manga} />
          ))}
        </div>
      </div>
    </>
  );
}
