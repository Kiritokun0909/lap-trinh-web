import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import MangaDetail from '../../../components/MangaDetail/MangaDetail';
import MangaDescription from '../../../components/MangaDescription/MangaDescription';
import ChapterList from '../../../components/ChapterList/ChapterList';
import Comments from '../../../components/Comment/Comments';
import ConfirmationBox from '../../../components/ConfirmationBox/ConfirmationBox';

import { deleteManga, getMangaById, updateMangaHideStatus } from '../../../api/mangaApi';
import { getListChapterByMangaId } from '../../../api/chapterApi';

import './MangaPage.css';
import HandleCode from '../../../utils/HandleCode';

export default function MangaPage() {
  const mangaId = useParams().mangaId;
  const [manga, setManga] = useState();
  const [chapters, setChapters] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const [actionType, setActionType] = useState(''); // 'delete' or 'hide'

  const navigate = useNavigate();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const data = await getMangaById(mangaId);
        document.title = data.mangaName;
        setManga(data);
      } catch (err) {
        toast.error(err.message);
        navigate('/admin');
      }
    };

    const fetchChapters = async () => {
      try {
        const data = await getListChapterByMangaId(mangaId);
        setChapters(data);
      } catch (err) {
        toast.error(err.message);
        navigate('/admin');
      }
    };

    fetchManga();
    fetchChapters();
  }, [mangaId, navigate]);

  const fetchManga = async () => {
    try {
      const data = await getMangaById(mangaId);
      document.title = data.mangaName;
      setManga(data);
    } catch (err) {
      toast.error(err.message);
      navigate('/admin');
    }
  };

  const handleEditManga = () => {
    navigate(`/admin/add-update-manga/${mangaId}`);
  };

  const handleAddChapter = () => {
    navigate(`/admin/add-chapter/${mangaId}`);
  };

  const handleDeleteManga = async () => {
    try {
      await deleteManga(mangaId);
      toast.success('Xoá truyện thành công.');
      navigate('/admin/manage-mangas');
    } catch (err) {
      toast.error('Không thể xoá truyện.');
    }
  };

  const handleUpdateHideStatus = async (isHide) => {
    try {
      await updateMangaHideStatus(mangaId, isHide);
      toast.success('Ẩn truyện thành công.');
    } catch (err) {
      toast.error('Không thể ẩn truyện.');
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    if (actionType === 'delete') {
      handleDeleteManga();
    } else if (actionType === 'hide') {
      handleUpdateHideStatus(
        manga.isHide === HandleCode.MANGA_HIDE_STATUS
          ? HandleCode.MANGA_SHOW_STATUS
          : HandleCode.MANGA_HIDE_STATUS
      );
    }

    setActionType('');
    fetchManga();
  };

  return (
    <div className='manga-page'>
      {showConfirm && (
        <ConfirmationBox
          message={
            actionType === 'delete'
              ? 'Bạn có chắc muốn xoá truyện này không?'
              : 'Bạn có chắc muốn ẩn truyện này không?'
          }
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <MangaDetail manga={manga} isAdmin={true} />
      <div className='btn-container'>
        <button className='function-btn' onClick={handleEditManga}>
          Sửa thông tin
        </button>
        <button
          className='function-btn'
          style={{ backgroundColor: 'green', color: 'white' }}
          onClick={handleAddChapter}
        >
          Thêm chương
        </button>
        <button
          className='function-btn'
          onClick={() => {
            setActionType('delete');
            setShowConfirm(true);
          }}
          style={{ backgroundColor: 'red', color: 'white' }}
        >
          Xoá truyện
        </button>
        <button
          className='function-btn'
          onClick={() => {
            setActionType('hide');
            setShowConfirm(true);
          }}
          style={{ backgroundColor: 'darkorchid', color: 'white' }}
        >
          {manga?.isHide === HandleCode.MANGA_HIDE_STATUS ? 'Huỷ ẩn truyện' : 'Ẩn truyện'}
        </button>
      </div>
      <MangaDescription manga={manga} />
      <ChapterList chapters={chapters} isAdmin={true} />
      <Comments />
    </div>
  );
}
