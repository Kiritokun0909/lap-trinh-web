import { FaComment, FaPaperPlane } from 'react-icons/fa';

import '../MangaDescription/MangaDescription.css';
import '../ChapterList/ChapterList.css';
import './Comments.css';

export default function Comments() {
  return (
    <>
      <div className='manga-description chapter-title'>
        <h3>
          <div className='info-icon-h3'>
            <FaComment />
          </div>
          <span>Bình luận</span>
        </h3>
      </div>
      <div className='user-comment'>
        <textarea
          className='comment-textarea'
          placeholder='Viết bình luận...'
        ></textarea>
        <button className='comment-btn'>
          <FaPaperPlane />
          <span>Gửi</span>
        </button>
      </div>
      <div className='list-comment'></div>
    </>
  );
}
