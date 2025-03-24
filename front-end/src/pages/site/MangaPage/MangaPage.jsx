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
import { useAuth } from '../../../context/AuthContext';
import {
  checkUserLikeFollowManga,
  likeFollowManga,
  unlikeUnfollowManga,
} from '../../../api/userApi';

export default function MangaPage() {
  const mangaId = useParams().mangaId;

  const { isLoggedIn } = useAuth();

  const [manga, setManga] = useState();
  const [chapters, setChapters] = useState([]);

  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const data = await getMangaById(mangaId);
        setManga(data);
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
        setChapters(data);
      } catch (err) {
        toast.error(err.message);
        navigate('/');
        console.error('Failed to get chapter by manga id: ', err);
      }
    };

    const fetchUserLikeFollowManga = async () => {
      try {
        const likeData = await checkUserLikeFollowManga(mangaId, 'like');
        const followData = await checkUserLikeFollowManga(mangaId, 'follow');
        setIsLiked(likeData.isLikeFollow);
        setIsFollowed(followData.isLikeFollow);
      } catch (err) {
        console.error('Failed to check user like manga: ', err);
      }
    };

    fetchManga();
    fetchChapters();
    fetchUserLikeFollowManga();
  }, [mangaId, navigate]);

  const handleLikeFollow = (type) => async () => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng này.');
      return;
    }

    try {
      if (type === 'follow' && isFollowed) {
        await unlikeUnfollowManga(mangaId, 'follow');
        toast.success('Huỷ theo dõi truyện thành công.');
        setIsFollowed(false);
      } else if (type === 'follow' && !isFollowed) {
        await likeFollowManga(mangaId, 'follow');
        toast.success('Theo dõi truyện thành công.');
        setIsFollowed(true);
      } else if (type === 'like' && isLiked) {
        await unlikeUnfollowManga(mangaId, 'like');
        toast.success('Huỷ thích truyện thành công.');
        setIsLiked(false);
      } else if (type === 'like' && !isLiked) {
        await likeFollowManga(mangaId, 'like');
        toast.success('Thích truyện thành công.');
        setIsLiked(true);
      }
    } catch (err) {
      toast.error(err.message);
      console.error('Failed to like follow manga: ', err);
    }
  };

  return (
    <div className='manga-page'>
      <MangaDetail manga={manga} />
      <div className='manga-page__btn-group'>
        <LikeButton isLiked={isLiked} onChange={handleLikeFollow('like')} />
        <FollowButton
          isFollowed={isFollowed}
          onChange={handleLikeFollow('follow')}
        />
      </div>
      <MangaDescription manga={manga} />
      <ChapterList chapters={chapters} />
      <Comments />
    </div>
  );
}
