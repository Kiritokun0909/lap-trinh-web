import {
  FaThumbsUp,
  FaThumbsDown,
  FaHeart,
  FaHeartBroken,
} from 'react-icons/fa';

import './LikeFollowButton.css';

export const FollowButton = ({ isFollowed, onChange }) => {
  return (
    <button className='like-follow-btn follow' onClick={onChange}>
      <div className='btn-icon'>
        {isFollowed ? <FaHeartBroken /> : <FaHeart />}
      </div>
      <span>{isFollowed ? 'Huỷ theo dõi' : 'Theo dõi'}</span>
    </button>
  );
};

export const LikeButton = ({ isLiked, onChange }) => {
  return (
    <button className='like-follow-btn like' onClick={onChange}>
      <div className='btn-icon'>
        {isLiked ? <FaThumbsDown /> : <FaThumbsUp />}
      </div>
      <span>{isLiked ? 'Huỷ yêu thích' : 'Yêu thích'}</span>
    </button>
  );
};
