import { Link } from 'react-router-dom';

import './AuthorBox.css';
import { DEFAULT_AUTHOR_IMAGE_URL } from '../../utils/utils';

export default function AuthorBox({ author, openModal }) {
  return (
    <div className='author-box__container' key={author.authorId} title={author.authorName}>
      <Link to='#' onClick={() => openModal(author)}>
        <img src={author.avatar || DEFAULT_AUTHOR_IMAGE_URL} alt={author.authorName} />
        <span>{author.authorName}</span>
      </Link>
    </div>
  );
}
