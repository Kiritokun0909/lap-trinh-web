import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

import { getImagesByChapterId } from '../../../api/chapterApi';
import { formatFullDate } from '../../../utils/utils';
import './ChapterPage.css';
import Comments from '../../../components/Comment/Comments';
import {
  deleteChapterComment,
  getListCommentByChapterId,
  postChapterComment,
} from '../../../api/commentApi';
import { useAuth } from '../../../context/AuthContext';

function ChapterNavigation({ chapter }) {
  return (
    <div className='chapter-navigate' style={{ marginTop: `0px` }}>
      <Link
        to={chapter?.prevChapterId ? `/chapter/${chapter?.prevChapterId}` : '#'}
        className={chapter?.prevChapterId ? '' : 'nav-disable'}
      >
        <div className='navigate-icon'>
          <FaArrowLeft />
        </div>
        Chap trước
      </Link>

      <Link
        to={chapter?.nextChapterId ? `/chapter/${chapter?.nextChapterId}` : '#'}
        className={chapter?.nextChapterId ? '' : 'nav-disable'}
      >
        Chap sau
        <div className='navigate-icon'>
          <FaArrowRight />
        </div>
      </Link>
    </div>
  );
}

export default function ChapterPage() {
  const chapterId = useParams().chapterId;
  const { isLoggedIn } = useAuth();

  const [chapter, setChapter] = useState({});

  const [comments, setComments] = useState([]);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapterImages = async () => {
      try {
        const data = await getImagesByChapterId(chapterId);
        setChapter(data);
        document.title = `Chap ${chapterId} - ${data?.mangaName}`;
      } catch (error) {
        toast.error(error.message);
        navigate('/');
        console.error('Failed to fetch chapter images:', error);
      }
    };

    fetchChapterImages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterId, navigate]);

  useEffect(() => {
    fetchComments();
  }, [chapterId, currentCommentPage]);

  const fetchComments = async () => {
    try {
      const data = await getListCommentByChapterId(chapterId, currentCommentPage, 5);
      setComments(data.comments);
      setTotalCommentPages(data.totalPages);
    } catch (err) {
      console.error('Failed to get comments by manga id: ', err);
    }
  };

  const handlePostComment = async (commentParentId, context) => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng này.');
      return;
    }

    try {
      await postChapterComment(chapterId, commentParentId, context);
      toast.success('Gửi bình luận thành công.');
      fetchComments();
    } catch (err) {
      console.error('Failed to post comment: ', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng này.');
      return;
    }
    try {
      await deleteChapterComment(commentId);
      toast.success('Xoá bình luận thành công.');
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment: ', err);
    }
  };

  return (
    <div className='chapter__container'>
      <div className='chapter__title'>
        <h2>
          <Link to={`/manga/${chapter?.mangaId}`}>{chapter?.mangaName}</Link>
          {' - '}Chap {chapter?.chapterNumber}
          {chapter?.updateAt && ` (Cập nhật lúc: ${formatFullDate(chapter?.updateAt)})`}
        </h2>
      </div>

      <ChapterNavigation chapter={chapter} />

      <div className='chapter-images__container'>
        {chapter?.chapterImages &&
          chapter?.chapterImages.map((image) => (
            <div key={image.pageId} className='chapter-image__row'>
              <img src={image.imageUrl} alt='Ảnh truyện' />
            </div>
          ))}
      </div>

      <ChapterNavigation chapter={chapter} />

      <Comments
        handlePostComment={handlePostComment}
        handleDeleteComment={handleDeleteComment}
        comments={comments}
        currentPage={currentCommentPage}
        totalPages={totalCommentPages}
        setCurrentPage={setCurrentCommentPage}
      />
    </div>
  );
}
