import { useEffect, useState } from 'react';

import '../ManageGenre/GenrePage.css';
import './AuthorPage.css';
import {
  addAuthor,
  deleteAuthor,
  getAuthors,
  updateAuthor,
} from '../../../api/authorApi';
import { toast } from 'react-toastify';
import AuthorList from '../../../components/AuthorList/AuthorList';
import AuthorModal from '../../../modals/AuthorModal/AuthorModal';
import { DEFAULT_ITEM_PER_PAGE } from '../../../utils/utils';
import { MdOutlineAdd } from 'react-icons/md';

import Pagination from '../../../components/Pagination/Pagination';

const PAGE_TITLE = 'Quản lý tác giả';

export default function AuthorPage() {
  const [authors, setAuthors] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await getAuthors(keyword, currentPage, DEFAULT_ITEM_PER_PAGE);
        setAuthors(data.items);
        setTotalPages(data.totalPages);
        // console.log(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    document.title = PAGE_TITLE;
    fetchAuthors();
  }, [keyword, currentPage]);

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors(keyword, currentPage, DEFAULT_ITEM_PER_PAGE);
      setAuthors(data.items);
      setTotalPages(data.totalPages);
      console.log(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openModal = (author) => {
    setShowModal(true);
    setSelectedAuthor(author);
  };

  const validateAuthor = (author) => {
    if (author?.authorName === '') {
      toast.error('Vui lòng không để trống tên tác giả!');
      return false;
    }
    return true;
  };

  const addNewAuthor = async (author) => {
    if (!validateAuthor(author)) {
      return;
    }

    try {
      await addAuthor(author.avatar, author.authorName, author.biography);
      toast.success('Thêm tác giả mới thành công!');
      setShowModal(false);

      fetchAuthors();
    } catch (err) {
      // console.log(">>err ", err);
      toast.error(err.message);
    }
  };

  const updateSelected = async (authorId, author) => {
    if (!validateAuthor(author)) {
      return;
    }

    try {
      await updateAuthor(authorId, author.avatar, author.authorName, author.biography);
      toast.success('Cập nhật tác giả thành công!');
      setShowModal(false);

      fetchAuthors();
    } catch (err) {
      // console.log(">>err ", err);
      toast.error(err.message);
    }
  };

  const deleteSelected = async (authorId) => {
    try {
      await deleteAuthor(authorId);
      toast.success('Xoá tác giả thành công!');
      setShowModal(false);

      fetchAuthors();
    } catch (err) {
      // console.log(">>err ", err);
      toast.error(err.message);
    }
  };

  return (
    <div className='page__container'>
      {showModal && (
        <AuthorModal
          author={selectedAuthor}
          onAdd={addNewAuthor}
          onUpdate={updateSelected}
          onDelete={deleteSelected}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className='page__header'>
        <h1>{PAGE_TITLE}</h1>
      </div>

      <div className='page__function'>
        <div className='search-input'>
          <input
            type='text'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Nhập tên tác giả muốn tìm...'
            className='search-input'
          />
        </div>
        <button className='function-button add-button' onClick={() => openModal(null)}>
          <MdOutlineAdd className='add-button-icon' />
          <span>Thêm</span>
        </button>
      </div>

      <AuthorList authors={authors} openModal={openModal} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
