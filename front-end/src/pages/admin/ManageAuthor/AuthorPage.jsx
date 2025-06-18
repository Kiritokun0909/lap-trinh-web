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
import ConfirmationBox from '../../../components/ConfirmationBox/ConfirmationBox';
import { AUTHOR_DEFAULT_ITEM_PER_PAGE } from '../../../utils/utils';
import { MdOutlineAdd } from 'react-icons/md';

import Pagination from '../../../components/Pagination/Pagination';

const PAGE_TITLE = 'Quản lý tác giả';

const CONFIRMATION_TYPE = {
  UPDATE: 'update',
  DELETE: 'delete',
};

export default function AuthorPage() {
  const [authors, setAuthors] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [confirmType, setConfirmType] = useState(CONFIRMATION_TYPE.UPDATE);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await getAuthors(keyword, currentPage, AUTHOR_DEFAULT_ITEM_PER_PAGE);
        setAuthors(data.items);
        setTotalPages(data.totalPages);
      } catch (err) {
        toast.error(err.message);
      }
    };

    document.title = PAGE_TITLE;
    fetchAuthors();
  }, [keyword, currentPage]);

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors(keyword, currentPage, AUTHOR_DEFAULT_ITEM_PER_PAGE);
      setAuthors(data.items);
      setTotalPages(data.totalPages);
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
    if (!validateAuthor(author)) return;

    try {
      await addAuthor(author.avatar, author.authorName, author.biography);
      toast.success('Thêm tác giả mới thành công!');
      setShowModal(false);
      fetchAuthors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateClick = (authorId, author) => {
    setSelectedAuthorId(authorId);
    setSelectedAuthor(author);
    setShowConfirmBox(true);
    setConfirmType(CONFIRMATION_TYPE.UPDATE);
  };

  const handleDeleteClick = (authorId) => {
    setSelectedAuthor(authorId);
    setShowConfirmBox(true);
    setConfirmType(CONFIRMATION_TYPE.DELETE);
  };

  const updateSelectedAuthor = async (authorId, author) => {
    if (!validateAuthor(author)) return;

    try {
      await updateAuthor(authorId, author.avatar, author.authorName, author.biography);
      toast.success('Cập nhật tác giả thành công!');
      setShowModal(false);
      setShowConfirmBox(false);
      setSelectedAuthor(null);
      fetchAuthors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteSelectedAuthor = async (authorId) => {
    try {
      await deleteAuthor(authorId);
      toast.success('Xoá tác giả thành công!');
      setShowModal(false);
      setShowConfirmBox(false);
      setSelectedAuthor(null);
      fetchAuthors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='page__container'>
      {showModal && (
        <AuthorModal
          author={selectedAuthor}
          onAdd={addNewAuthor}
          onUpdate={handleUpdateClick}
          onDelete={handleDeleteClick}
          onClose={() => setShowModal(false)}
        />
      )}

      {showConfirmBox && selectedAuthor && (
        <ConfirmationBox
          title={
            confirmType === CONFIRMATION_TYPE.UPDATE
              ? 'Xác nhận cập nhật'
              : 'Xác nhận xoá'
          }
          message={
            confirmType === CONFIRMATION_TYPE.UPDATE
              ? `Bạn có chắc chắn muốn cập nhật tác giả này?`
              : 'Bạn có chắc chắn muốn xoá tác giả này?'
          }
          onConfirm={() => {
            if (confirmType === CONFIRMATION_TYPE.UPDATE) {
              updateSelectedAuthor(selectedAuthorId, selectedAuthor);
            } else {
              deleteSelectedAuthor(selectedAuthor);
            }
          }}
          onCancel={() => {
            setShowConfirmBox(false);
            setSelectedAuthor(null);
          }}
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
