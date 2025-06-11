import { useState } from 'react';
import { FaComment, FaPaperPlane, FaReply, FaThumbsUp } from 'react-icons/fa';

import '../MangaDescription/MangaDescription.css';
import '../ChapterList/ChapterList.css';
import './Comments.css';
import Pagination from '../Pagination/Pagination';

import { formatDate } from '../../utils/utils';
import { DEFAULT_AUTHOR_IMAGE_URL } from '../../utils/utils';

function CommentItem({ comment, onReply }) {
  const [showReplies, setShowReplies] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className='comment-container'>
      <div className='comment'>
        <img
          src={comment?.user?.avatar ? comment.user.avatar : DEFAULT_AUTHOR_IMAGE_URL}
          alt={comment?.user?.username}
          className='comment-avatar'
        />
        <div className='comment-content'>
          <div className='comment-text'>
            <span className='comment-username'>{comment.user.username}</span>
            <span>{comment.context}</span>
          </div>
          <div className='comment-actions'>
            <span className='comment-action'>
              <span className='comment-date'>{formatDate(comment.createdAt)}</span>
            </span>
            <span className='comment-action' onClick={() => onReply(comment)}>
              <FaReply /> Phản hồi
            </span>
          </div>
        </div>
      </div>

      {hasReplies && (
        <>
          {!showReplies && (
            <button className='show-replies-btn' onClick={() => setShowReplies(true)}>
              Xem {comment.replies.length} phản hồi
            </button>
          )}

          {showReplies && (
            <div className='replies-container'>
              {comment.replies.map((reply) => (
                <div key={reply.commentId} className='reply'>
                  <img
                    src={
                      reply?.user?.avatar ? reply.user.avatar : DEFAULT_AUTHOR_IMAGE_URL
                    }
                    alt={reply?.user?.username}
                    className='comment-avatar'
                  />
                  <div className='comment-content'>
                    <div className='comment-text'>
                      <span className='comment-username'>{reply.user.username}</span>
                      <span>{reply.context}</span>
                    </div>
                    <div className='comment-actions'>
                      <span className='comment-action'>
                        <span className='comment-date'>
                          {formatDate(reply.createdAt)}
                        </span>
                      </span>
                      <span className='comment-action' onClick={() => onReply(comment)}>
                        <FaReply /> Phản hồi
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <button className='show-replies-btn' onClick={() => setShowReplies(false)}>
                Ẩn phản hồi
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Comments({
  handlePostComment,
  comments,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const [replyTo, setReplyTo] = useState(null);
  const [userComment, setUserComment] = useState('');
  const [commentParentId, setCommentParentId] = useState(null);

  const handleReply = (comment) => {
    setReplyTo(comment);
    setUserComment(`@${comment.user.username} `);
    setCommentParentId(comment.commentId);
  };

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
          placeholder={'Viết bình luận mới...'}
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
        />
        <div className='comment-btn-container'>
          <button
            className='comment-btn'
            onClick={() => {
              if (userComment.trim() !== '') {
                handlePostComment(commentParentId, userComment);
                setUserComment('');
                setCommentParentId(null);
              }
            }}
          >
            <FaPaperPlane />
            <span>Gửi</span>
          </button>
        </div>
      </div>
      <div className='list-comment'>
        {comments.map((comment) => (
          <CommentItem key={comment.commentId} comment={comment} onReply={handleReply} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
