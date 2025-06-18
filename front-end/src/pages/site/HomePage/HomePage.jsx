import React, { useEffect, useState } from 'react';

import { getMangas } from '../../../api/mangaApi';
import MangaBox from '../../../components/MangaBox/MangaBox';
import './HomePage.css';

import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { toast } from 'react-toastify';
import MangaList from '../../../components/MangaList/MangaList';
import HandleCode from '../../../utils/HandleCode';

const HOME_PAGE_TITLE = 'Trang chủ';
const NUMBER_OF_TOP_MANGAS = 10;
const NUMBER_OF_NEW_UPDATES = 15;

function TopMangas({ topMangas }) {
  return (
    <div className='top-mangas__container'>
      <h2>Được yêu thích</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView='auto'
        autoplay={{ delay: 3000 }}
        spaceBetween={16}
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
      <MangaList mangas={newUpdates} />
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
      const response = await getMangas(
        1,
        NUMBER_OF_TOP_MANGAS,
        '',
        HandleCode.FILTER_BY_MANGA_NUM_LIKES_DESC
      );
      setTopMangas(response.items);
    } catch (error) {
      toast.error(error.message);
      console.error('Failed to fetch list manga: ', error);
    }
  };

  const fetchMangas = async () => {
    try {
      const response = await getMangas(
        1,
        NUMBER_OF_NEW_UPDATES,
        '',
        HandleCode.FILTER_BY_MANGA_UPDATE_AT_DESC
      );
      setMangas(response.items);
    } catch (error) {
      console.error('Failed to fetch list manga: ', error);
    }
  };

  return (
    <>
      <TopMangas topMangas={topMangas} />

      <div className='new-updates__container'>
        <NewUpdates newUpdates={mangas} />
      </div>
    </>
  );
}
