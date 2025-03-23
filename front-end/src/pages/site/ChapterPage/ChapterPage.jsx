import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

import { getImagesByChapterId } from '../../../api/chapterApi';
import { formatFullDate } from '../../../utils/utils';
import './ChapterPage.css';
import Comments from '../../../components/Comment/Comments';

function ChapterNavigation({ chapter }) {
  return (
    <div className='chapter-navigate' style={{ marginTop: `0px` }}>
      {chapter?.prevChapterId ? (
        <Link to={`/chapter/${chapter?.prevChapterId}`}>
          <div className='navigate-icon'>
            <FaArrowLeft />
          </div>
          Chap trước
        </Link>
      ) : (
        <Link to='#' className='nav-disable'>
          <div className='navigate-icon'>
            <FaArrowLeft />
          </div>
          Chap trước
        </Link>
      )}

      {chapter?.nextChapterId ? (
        <Link to={`/chapter/${chapter?.nextChapterId}`}>
          Chap sau
          <div className='navigate-icon'>
            <FaArrowRight />
          </div>
        </Link>
      ) : (
        <Link to='#' className='nav-disable'>
          Chap sau
          <div className='navigate-icon'>
            <FaArrowRight />
          </div>
        </Link>
      )}
    </div>
  );
}

export default function ChapterPage() {
  const chapterId = useParams().chapterId;
  const [chapter, setChapter] = useState({});

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
  }, [chapterId, navigate]);

  return (
    <div className='chapter__container'>
      <div className='chapter__title'>
        <h2>
          <Link to={`/manga/${chapter?.mangaId}`}>{chapter?.mangaName}</Link>
          {' - '}Chap {chapter?.chapterNumber}
          {chapter?.updateAt &&
            ` (Cập nhật lúc: ${formatFullDate(chapter?.updateAt)})`}
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

      <Comments />
    </div>
  );
}
