import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getGenres, addGenre, deleteGenre, updateGenre } from '../../../api/genreApi.js';

import GenreTable from '../../../components/GenreTable/GenreTable';
import GenreModal from '../../../modals/GenreModal/GenreModal';

import { capitalizeFirstLetter } from '../../../utils/utils.js';

import './GenrePage.css';

const PAGE_TITLE = 'Quản lý thể loại';

export default function GenrePage() {
  const [genres, setGenres] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [showModal, setShowModal] = useState(false);

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
      // console.log(">>err ", err);
      toast.error(err.message);
    }
  };

  const updateSelectedGenre = async (genreId, editedGenreName) => {
    try {
      await updateGenre(genreId, capitalizeFirstLetter(editedGenreName));
      toast.success('Cập nhật tên thể loại thành công!');

      fetchGenres();
    } catch (err) {
      // console.log(">>err ", err);
      toast.error(err.message);
    }
  };

  const deleteSelectedGenre = async (genreIds) => {
    try {
      await deleteGenre(genreIds);
      toast.success('Xoá thể loại thành công!');

      fetchGenres();
    } catch (err) {
      // console.log(">>err ", err);
      toast.error(err.message);
    }
  };

  return (
    <div className='page__container'>
      {showModal && <GenreModal onSave={addNewGenre} onClose={() => setShowModal(false)} />}

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
        onUpdate={updateSelectedGenre}
        onDelete={deleteSelectedGenre}
        openModal={() => setShowModal(true)}
      />
    </div>
  );
}
