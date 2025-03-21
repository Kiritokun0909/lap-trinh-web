import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import './MangaPage.css';

import { getMangaById } from '../../../api/mangaApi';
import { getListChapterByMangaId } from '../../../api/chapterApi';

import MangaDetail from '../../../components/MangaDetail/MangaDetail';
import ChapterList from '../../../components/ChapterList/ChapterList';
import MangaDescription from '../../../components/MangaDescription/MangaDescription';
import Comments from '../../../components/Comment/Comments';
import {
  LikeButton,
  FollowButton,
} from '../../../components/LikeFollowButton/LikeFollowButton';

export default function MangaPage() {
  const mangaId = useParams().mangaId;
  const [manga, setManga] = useState();
  const [chapters, setChapters] = useState([]);

  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const data = await getMangaById(mangaId);
        setTimeout(() => {
          setManga(data);
        }, 1000);
        document.title = data.mangaName;
      } catch (err) {
        toast.error(err.message);
        navigate('/');
        console.error('Failed to get manga by id: ', err);
      }
    };

    const fetchChapters = async () => {
      try {
        const data = await getListChapterByMangaId(mangaId);
        setTimeout(() => {
          setChapters(data);
        }, 1000);
      } catch (err) {
        toast.error(err.message);
        navigate('/');
        console.error('Failed to get chapter by manga id: ', err);
      }
    };

    fetchManga();
    fetchChapters();
  }, [mangaId, navigate]);

  return (
    <div className='manga-page'>
      <MangaDetail manga={manga} />
      <div className='manga-page__btn-group'>
        <LikeButton isLiked={isLiked} onChange={() => setIsLiked(!isLiked)} />
        <FollowButton
          isFollowed={isFollowed}
          onChange={() => setIsFollowed(!isFollowed)}
        />
      </div>
      <MangaDescription manga={manga} />
      <ChapterList chapters={chapters} />
      <Comments />
    </div>
  );
}
