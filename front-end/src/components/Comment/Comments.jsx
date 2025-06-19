import { useState } from 'react';
import { FaComment, FaPaperPlane, FaReply, FaTrash } from 'react-icons/fa';

import '../MangaDescription/MangaDescription.css';
import '../ChapterList/ChapterList.css';
import './Comments.css';
import Pagination from '../Pagination/Pagination';

import { formatDate } from '../../utils/utils';
import { DEFAULT_AUTHOR_IMAGE_URL } from '../../utils/utils';
import { useAuth } from '../../context/AuthContext';
import HandleCode from '../../utils/HandleCode';

function CommentContent({
  avatar,
  username,
  context,
  isDeleted,
  createdAt,
  onReply,
  onDelete,
  canReply,
  canDelete,
}) {
  // Helper to render context with mention
  const renderContext = () => {
    const match = context?.match(/^(@\w+)\s(.*)$/);
    if (match) {
      return (
        <span style={isDeleted ? { fontStyle: 'italic' } : {}}>
          <span style={{ color: '#2563eb', fontWeight: 500 }}>{match[1]}</span> {match[2]}
        </span>
      );
    } else {
      return (
        <span style={isDeleted ? { fontStyle: 'italic', color: 'gray' } : {}}>
          {context}
        </span>
      );
    }
  };

  return (
    <>
      <img
        src={avatar ? avatar : DEFAULT_AUTHOR_IMAGE_URL}
        alt={username}
        className='comment-avatar'
      />
      <div className='comment-content'>
        <div className='comment-text'>
          <span className='comment-username'>{username}</span>
          {renderContext()}
        </div>
        <div className='comment-actions'>
          <span className='comment-action'>
            <span className='comment-date'>{formatDate(createdAt)}</span>
          </span>
          {canReply && !isDeleted && (
            <span className='comment-action' onClick={onReply}>
              <FaReply /> Phản hồi
            </span>
          )}
          {canDelete && !isDeleted && (
            <span className='comment-action' onClick={onDelete}>
              <FaTrash /> Xoá bình luận
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function CommentItem({ comment, onReply, onDelete }) {
  const { roleId, userId } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  const canReply = comment.isDeleted === 0;
  const canDelete =
    comment.isDeleted === 0 &&
    (roleId === HandleCode.ROLE_ADMIN || comment.user.userId === userId);

  return (
    <div className='comment-container'>
      <div className='comment'>
        <CommentContent
          avatar={comment?.user?.avatar}
          username={comment?.user?.username}
          context={comment.context}
          isDeleted={comment.isDeleted === 1}
          createdAt={comment.createdAt}
          onReply={() => onReply(comment)}
          onDelete={() => onDelete(comment.commentId)}
          canReply={canReply}
          canDelete={canDelete}
        />
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
              {comment.replies.map((reply) => {
                const replyCanReply = reply.isDeleted === 0;
                const replyCanDelete =
                  reply.isDeleted === 0 &&
                  (roleId === HandleCode.ROLE_ADMIN || reply.userId === userId);
                return (
                  <div key={reply.commentId} className='reply'>
                    <CommentContent
                      avatar={reply?.user?.avatar}
                      username={reply?.user?.username}
                      context={reply.context}
                      isDeleted={reply.isDeleted === 1}
                      createdAt={reply.createdAt}
                      onReply={() => onReply(reply)}
                      onDelete={() => onDelete(reply.commentId)}
                      canReply={replyCanReply}
                      canDelete={replyCanDelete}
                    />
                  </div>
                );
              })}
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
  handleDeleteComment,
  comments,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const [userComment, setUserComment] = useState('');
  const [commentParentId, setCommentParentId] = useState(null);

  const handleReply = (comment) => {
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
          onChange={(e) => {
            const newValue = e.target.value;
            setUserComment(newValue);
            if (newValue.trim() === '') {
              setCommentParentId(null);
            }
          }}
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
          <CommentItem
            key={comment.commentId}
            comment={comment}
            onReply={handleReply}
            onDelete={handleDeleteComment}
          />
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
