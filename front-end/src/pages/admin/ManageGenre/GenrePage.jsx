import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getGenres, addGenre, deleteGenre, updateGenre } from '../../../api/genreApi.js';

import GenreTable from '../../../components/GenreTable/GenreTable';
import GenreModal from '../../../modals/GenreModal/GenreModal';
import ConfirmationBox from '../../../components/ConfirmationBox/ConfirmationBox';

import { capitalizeFirstLetter } from '../../../utils/utils.js';

import './GenrePage.css';

const PAGE_TITLE = 'Quản lý thể loại';

const CONFIRMATION_TYPE = {
  UPDATE: 'update',
  DELETE: 'delete',
};

export default function GenrePage() {
  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [searchName, setSearchName] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [confirmType, setConfirmType] = useState(CONFIRMATION_TYPE.UPDATE);

  useEffect(() => {
    document.title = PAGE_TITLE;
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    const data = await getGenres();
    setGenres(data);
  };

  const validateGenreName = (name) => {
    if (name === '') {
      toast.error('Vui lòng không để trống tên thể loại!');
      return false;
    }
    return true;
  };

  const addNewGenre = async (genreName) => {
    if (!validateGenreName(genreName)) {
      return;
    }

    try {
      await addGenre(capitalizeFirstLetter(genreName));
      toast.success('Thêm thể loại mới thành công!');
      setShowModal(false);

      fetchGenres();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateClick = (genre) => {
    setSelectedGenre(genre);
    setShowConfirmBox(true);
    setConfirmType(CONFIRMATION_TYPE.UPDATE);
  };

  const handleDeleteClick = (genreIds) => {
    setSelectedGenre(genreIds);
    setShowConfirmBox(true);
    setConfirmType(CONFIRMATION_TYPE.DELETE);
  };

  const updateSelectedGenre = async (genreId, editedGenreName) => {
    try {
      await updateGenre(genreId, capitalizeFirstLetter(editedGenreName));
      toast.success('Cập nhật tên thể loại thành công!');
      setShowConfirmBox(false);
      setSelectedGenre(null);

      fetchGenres();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteSelectedGenre = async (genreIds) => {
    try {
      await deleteGenre(genreIds);
      toast.success('Xoá thể loại thành công!');
      setShowConfirmBox(false);
      setSelectedGenre(null);

      fetchGenres();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='page__container'>
      {showModal && (
        <GenreModal onSave={addNewGenre} onClose={() => setShowModal(false)} />
      )}

      {showConfirmBox && selectedGenre && (
        <ConfirmationBox
          title={
            confirmType === CONFIRMATION_TYPE.UPDATE
              ? `Xác nhận cập nhật`
              : `Xác nhận xoá`
          }
          message={
            confirmType === CONFIRMATION_TYPE.UPDATE
              ? `Bạn có chắc chắn muốn cập nhật thể loại "${selectedGenre.genreName}"?`
              : `Bạn có chắc chắn muốn xoá các thể loại đã chọn ?`
          }
          onConfirm={() => {
            if (confirmType === CONFIRMATION_TYPE.UPDATE) {
              updateSelectedGenre(selectedGenre.genreId, selectedGenre.genreName);
            } else {
              deleteSelectedGenre(selectedGenre);
            }
          }}
          onCancel={() => {
            setConfirmType(false);
            setSelectedGenre(null);
          }}
        />
      )}

      <div className='page__header'>
        <h1>{PAGE_TITLE}</h1>
      </div>

      <div className='search-input'>
        <input
          type='text'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder='Nhập thể loại muốn tìm...'
          className='search-input'
        />
      </div>

      <GenreTable
        genres={genres}
        searchName={searchName}
        onUpdate={handleUpdateClick}
        onDelete={handleDeleteClick}
        openModal={() => setShowModal(true)}
      />
    </div>
  );
}
