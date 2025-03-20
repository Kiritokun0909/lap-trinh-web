import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getMangaById } from '../../../api/mangaApi';
import MangaDetail from '../../../components/MangaDetail/MangaDetail';
import './MangaPage.css';
import { ChapterList } from '../../../components/ChapterList/ChapterList';
import MangaDescription from '../../../components/MangaDescription/MangaDescription';
import { getListChapterByMangaId } from '../../../api/chapterApi';
import Comments from '../../../components/Comment/Comments';

export default function MangaPage() {
  const mangaId = useParams().mangaId;
  const [manga, setManga] = useState();
  const [chapters, setChapters] = useState([]);

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
        setChapters(data);
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
    <>
      <MangaDetail manga={manga} />
      <MangaDescription manga={manga} />
      <ChapterList chapters={chapters} />
      <Comments />
    </>
  );
}
