import React, { useState } from 'react';
import { IoMdTrash } from 'react-icons/io';
import { MdEdit, MdDelete, MdCheck, MdOutlineAdd } from 'react-icons/md';

import './GenreTable.css';

export default function GenreTable({
  genres,
  searchName,
  onUpdate,
  onDelete,
  openModal,
}) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [editedGenreName, setEditedGenreName] = useState('');

  const filteredGenres = genres.filter((genre) =>
    genre.genreName.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGenres(filteredGenres.map((genre) => genre.genreId));
    } else {
      setSelectedGenres([]);
    }
  };

  const handleSelectGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleEdit = (genre) => {
    setEditingGenreId(genre.genreId);
    setEditedGenreName(genre.genreName);
  };

  const handleSaveEdit = () => {
    onUpdate({ genreId: editingGenreId, genreName: editedGenreName });
    setEditingGenreId(null);
  };

  const handleBulkDelete = () => {
    if (selectedGenres.length === 0) return;
    onDelete(selectedGenres);
    setSelectedGenres([]);
  };

  return (
    <>
      <div className='buttons-section'>
        <button className='function-button delete-all-button' onClick={handleBulkDelete}>
          <IoMdTrash className='add-button-icon' />
          Xóa tất cả đã chọn ({selectedGenres.length})
        </button>
        <button className='function-button add-button' onClick={openModal}>
          <MdOutlineAdd className='add-button-icon' />
          <span>Thêm</span>
        </button>
      </div>

      <div className='list-genres'>
        <table className='genre-table'>
          <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  onChange={handleSelectAll}
                  checked={
                    selectedGenres.length === filteredGenres.length &&
                    filteredGenres.length > 0
                  }
                />
              </th>
              <th>Tên thể loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredGenres.map((genre) => (
              <tr key={genre.genreId} className='genre-row'>
                <td>
                  <input
                    type='checkbox'
                    checked={selectedGenres.includes(genre.genreId)}
                    onChange={() => handleSelectGenre(genre.genreId)}
                  />
                </td>
                <td>
                  {editingGenreId === genre.genreId ? (
                    <input
                      type='text'
                      value={editedGenreName}
                      onChange={(e) => setEditedGenreName(e.target.value)}
                      className='edit-input'
                    />
                  ) : (
                    genre.genreName
                  )}
                </td>
                <td>
                  {editingGenreId === genre.genreId ? (
                    <button className='finish-button' onClick={handleSaveEdit}>
                      <MdCheck />
                      Hoàn tất
                    </button>
                  ) : (
                    <div className='action-buttons'>
                      <button className='edit-button' onClick={() => handleEdit(genre)}>
                        <MdEdit />
                        Cập nhật
                      </button>
                      <button
                        className='delete-button'
                        onClick={() => onDelete([genre.genreId])}
                      >
                        <MdDelete />
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
