import { useState } from 'react';

import '../Modal.css';

import { DEFAULT_AUTHOR_IMAGE_URL } from '../../utils/utils';
import { uploadImage } from '../../api/uploadApi';
import { toast } from 'react-toastify';

const ADD_HEADER = 'Thêm tác giả';
const EDIT_HEADER = 'Cập nhật tác giả';

export default function AuthorModal({ author, onAdd, onUpdate, onDelete, onClose }) {
  const isAdd = author === null;

  const [avatar, setAvatar] = useState(author?.avatar || '');
  const [authorName, setAuthorName] = useState(author?.authorName || '');
  const [biography, setBiography] = useState(author?.biography || '');

  const [isLoading, setIsLoading] = useState(false);

  const handleAddNewAuthor = async (e) => {
    e.preventDefault();
    const newAuthor = { avatar, authorName, biography };
    onAdd(newAuthor);
  };

  const handleUpdateAuthor = async (e) => {
    e.preventDefault();
    const newAuthor = { avatar, authorName, biography };
    onUpdate(author.authorId, newAuthor);
  };

  const handleDeleteAuthor = async (e) => {
    e.preventDefault();
    onDelete(author.authorId);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);

    try {
      const data = await uploadImage(file);
      setAvatar(data.imageUrl);
      toast.success('Tải ảnh lên thành công');
    } catch (err) {
      toast.error(err.message || 'Tải ảnh lên thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('avatarUpload').click();
  };

  return (
    <div className='modal-box'>
      <form
        className='modal-form'
        onSubmit={isAdd ? handleAddNewAuthor : handleUpdateAuthor}
      >
        <div className='modal-header'>
          <span>{isAdd ? ADD_HEADER : EDIT_HEADER}</span>
        </div>

        {isLoading ? (
          <div className='loading-spinner'>Đang tải lên...</div>
        ) : (
          <img className='avatar' src={avatar || DEFAULT_AUTHOR_IMAGE_URL} alt='Avatar' />
        )}

        <input
          id='avatarUpload'
          type='file'
          style={{ display: 'none' }}
          accept='image/*'
          onChange={handleImageChange}
        />

        <button type='button' onClick={handleButtonClick} className='change-image-btn'>
          Chọn ảnh
        </button>

        <input
          type='text'
          placeholder='Nhập tên tác giả'
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />

        <textarea
          placeholder='Nhập tiểu sử tác giả'
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
        />

        <div className='modal-button'>
          {!isAdd && (
            <button type='button' className='delete-button' onClick={handleDeleteAuthor}>
              Xoá
            </button>
          )}
          <button type='submit' className='accept-button'>
            {isAdd ? 'Thêm' : 'Cập nhật'}
          </button>

          <button type='button' className='cancel-button' onClick={onClose}>
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
}
