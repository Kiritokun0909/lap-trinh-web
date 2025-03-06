import React, { useEffect, useState } from "react";
import { getMangas } from "../../api/mangaApi";
import "../../styles/site/HomePage.css";
import MangaBox, { MangaBoxProps } from "../../components/site/MangaBox.tsx";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const HOME_PAGE_TITLE = "Manga Reader - HomePage";
const NUMBER_OF_TOP_MANGAS = 8;
const NUMBER_OF_NEW_UPDATES = 20;

function TopMangas({ topMangas }) {
  return (
    <div>
      <h2>Top Manga</h2>
      <Swiper
        className="swiper-container"
        modules={[Autoplay]}
        slidesPerView="auto"
        centeredSlides={true}
        spaceBetween={16}
        autoplay={{ delay: 2000 }}
        loop={true}
      >
        {topMangas.map((manga) => (
          <SwiperSlide key={manga.mangaId}>
            <MangaBox key={manga.mangaId} manga={manga} showChapter={false} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function NewUpdates({ newUpdates }) {
  return (
    <div>
      <h2>New Updates</h2>
      <div className="list-manga-item">
        {newUpdates.map((manga) => (
          <MangaBox key={manga.mangaId} manga={manga} showChapter={true} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [topMangas, setTopMangas] = useState<MangaBoxProps[]>([]);
  const [mangas, setMangas] = useState<MangaBoxProps[]>([]);

  useEffect(() => {
    document.title = HOME_PAGE_TITLE;
    fetchTopMangas();
    fetchMangas();
  }, []);

  const fetchTopMangas = async () => {
    try {
      const response = await getMangas(1, NUMBER_OF_TOP_MANGAS);
      // console.log("Top mangas: ", response.items);
      setTopMangas(response.items);
    } catch (error) {
      console.error("Failed to fetch list manga: ", error);
    }
  };

  const fetchMangas = async () => {
    try {
      const response = await getMangas(1, NUMBER_OF_NEW_UPDATES);
      setMangas(response.items);
    } catch (error) {
      console.error("Failed to fetch list manga: ", error);
    }
  };

  return (
    <>
      <TopMangas topMangas={topMangas} />

      <NewUpdates newUpdates={mangas} />
    </>
  );
}
