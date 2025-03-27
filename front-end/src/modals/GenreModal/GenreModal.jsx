import { useState } from 'react';
import './GenreModal.css';

export default function GenreModal({ onSave, onClose }) {
  const [genreName, setGenreName] = useState('');

  const handleAddNewGenre = async (e) => {
    e.preventDefault();
    onSave(genreName);
  };

  return (
    <div className='modal-box'>
      <form className='modal-form' onSubmit={handleAddNewGenre}>
        <div className='modal-header'>
          <span>Thêm thể loại</span>
        </div>

        <input
          type='text'
          placeholder='Nhập tên thể loại mới muốn thêm...'
          value={genreName}
          onChange={(e) => setGenreName(e.target.value)}
        />

        <div className='modal-button'>
          <button type='submit' className='accept-button'>
            Thêm
          </button>
          <button type='button' className='cancel-button' onClick={onClose}>
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
}
