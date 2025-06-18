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
import { getListCommentByMangaId, postMangaComment } from '../../../api/commentApi';
import { useAuth } from '../../../context/AuthContext';

const CONFIRMATION_MESSAGES = {
  DELETE: {
    title: 'Xác nhận xóa truyện',
    message:
      'Bạn có chắc chắn muốn xóa truyện này không? Hành động này không thể hoàn tác.',
  },
  HIDE: {
    title: 'Xác nhận ẩn truyện',
    message:
      'Bạn có chắc chắn muốn ẩn truyện này không? Truyện sẽ không hiển thị với người dùng.',
  },
  UNHIDE: {
    title: 'Xác nhận hiện truyện',
    message:
      'Bạn có chắc chắn muốn hiện truyện này không? Truyện sẽ được hiển thị lại với người dùng.',
  },
};

export default function MangaPage() {
  const mangaId = useParams().mangaId;

  const { isLoggedIn } = useAuth();

  const [manga, setManga] = useState();
  const [chapters, setChapters] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const [actionType, setActionType] = useState(''); // 'delete' or 'hide'

  const [comments, setComments] = useState([]);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);

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

  useEffect(() => {
    fetchComments();
  }, [mangaId, currentCommentPage]);

  const fetchComments = async () => {
    try {
      const data = await getListCommentByMangaId(mangaId, currentCommentPage, 5);
      setComments(data.comments);
      setTotalCommentPages(data.totalPages);
    } catch (err) {
      console.error('Failed to get comments by manga id: ', err);
    }
  };

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
      toast.success('Xóa truyện thành công.');
      navigate('/admin/manage-mangas');
    } catch (err) {
      toast.error('Không thể xóa truyện. Vui lòng thử lại sau.');
    }
  };

  const handleUpdateHideStatus = async (isHide) => {
    try {
      await updateMangaHideStatus(mangaId, isHide);
      toast.success(isHide ? 'Ẩn truyện thành công.' : 'Hiện truyện thành công.');
      fetchManga();
    } catch (err) {
      toast.error('Không thể thay đổi trạng thái truyện. Vui lòng thử lại sau.');
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
  };

  const getConfirmationContent = () => {
    if (actionType === 'delete') {
      return CONFIRMATION_MESSAGES.DELETE;
    }
    return manga?.isHide === HandleCode.MANGA_HIDE_STATUS
      ? CONFIRMATION_MESSAGES.UNHIDE
      : CONFIRMATION_MESSAGES.HIDE;
  };

  const handlePostComment = async (commentParentId, context) => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng này.');
      return;
    }
    try {
      await postMangaComment(mangaId, commentParentId, context);
      toast.success('Gửi bình luận thành công.');
      fetchComments();
    } catch (err) {
      console.error('Failed to post comment: ', err);
    }
  };

  return (
    <div className='manga-page'>
      {showConfirm && (
        <ConfirmationBox
          title={getConfirmationContent().title}
          message={getConfirmationContent().message}
          onConfirm={handleConfirm}
          onCancel={() => {
            setShowConfirm(false);
            setActionType('');
          }}
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
          Xóa truyện
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
      <Comments
        handlePostComment={handlePostComment}
        comments={comments}
        currentPage={currentCommentPage}
        totalPages={totalCommentPages}
        setCurrentPage={setCurrentCommentPage}
      />
    </div>
  );
}
