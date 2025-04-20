import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import MangaDetail from '../../../components/MangaDetail/MangaDetail';
import MangaDescription from '../../../components/MangaDescription/MangaDescription';
import ChapterList from '../../../components/ChapterList/ChapterList';
import Comments from '../../../components/Comment/Comments';

import { deleteManga, getMangaById } from '../../../api/mangaApi';
import { getListChapterByMangaId } from '../../../api/chapterApi';

import './MangaPage.css';

export default function MangaPage() {
  const mangaId = useParams().mangaId;

  const [manga, setManga] = useState();
  const [chapters, setChapters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const data = await getMangaById(mangaId);
        document.title = data.mangaName;
        setManga(data);
        console.log(data);
      } catch (err) {
        toast.error(err.message);
        navigate('/admin');
        console.error('Failed to get manga by id: ', err);
      }
    };

    const fetchChapters = async () => {
      try {
        const data = await getListChapterByMangaId(mangaId);
        setChapters(data);
      } catch (err) {
        toast.error(err.message);
        navigate('/admin');
        console.error('Failed to get chapter by manga id: ', err);
      }
    };

    fetchManga();
    fetchChapters();
  }, [mangaId, navigate]);

  const handleEditManga = () => {
    navigate(`/admin/add-update-manga/${mangaId}`);
  };

  const handleDeleteManga = async () => {
    try {
      await deleteManga(mangaId);
      toast.success('Xoá truyện thành công.');
      navigate('/admin/manage-mangas');
    } catch (err) {}
  };

  return (
    <div className='manga-page'>
      <MangaDetail manga={manga} />
      <div className='btn-container'>
        <button className='function-btn' onClick={handleEditManga}>
          Sửa thông tin
        </button>
        <button
          className='function-btn'
          style={{ backgroundColor: 'green', color: 'white' }}
        >
          Thêm chương
        </button>
        <button
          className='function-btn'
          onClick={handleDeleteManga}
          style={{ backgroundColor: 'red', color: 'white' }}
        >
          Xoá truyện
        </button>
        <button
          className='function-btn'
          style={{ backgroundColor: 'darkorchid', color: 'white' }}
        >
          Ẩn truyện
        </button>
      </div>
      <MangaDescription manga={manga} />
      <ChapterList chapters={chapters} />
      <Comments />
    </div>
  );
}
