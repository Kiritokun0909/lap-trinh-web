import AuthorBox from '../AuthorBox/AuthorBox';
import './AuthorList.css';

export default function AuthorList({ authors, openModal }) {
  return (
    <div className='author-list__container'>
      {authors.map((author) => (
        <AuthorBox key={author.authorId} author={author} openModal={openModal} />
      ))}
    </div>
  );
}
