import React, { useEffect, useState } from 'react';

import { getMangas } from '../../../api/mangaApi';
import MangaBox from '../../../components/site/MangaBox/MangaBox';
import './HomePage.css';

import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { toast } from 'react-toastify';

const HOME_PAGE_TITLE = 'Trang chủ';
const NUMBER_OF_TOP_MANGAS = 20;
const NUMBER_OF_NEW_UPDATES = 20;

function TopMangas({ topMangas }) {
  return (
    <div>
      <h2>Được yêu thích</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={2}
        centeredSlides={true}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 0,
          },
        }}
        autoplay={{ delay: 3000 }}
        loop
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
      <h2>Mới cập nhật</h2>
      <div className='list-manga-item'>
        {newUpdates.map((manga) => (
          <MangaBox key={manga.mangaId} manga={manga} showChapter={true} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [topMangas, setTopMangas] = useState([]);
  const [mangas, setMangas] = useState([]);

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
      toast.error(error.message);
      console.error('Failed to fetch list manga: ', error);
    }
  };

  const fetchMangas = async () => {
    try {
      const response = await getMangas(1, NUMBER_OF_NEW_UPDATES);
      setMangas(response.items);
    } catch (error) {
      console.error('Failed to fetch list manga: ', error);
    }
  };

  return (
    <>
      <TopMangas topMangas={topMangas} />

      <NewUpdates newUpdates={mangas} />
    </>
  );
}
