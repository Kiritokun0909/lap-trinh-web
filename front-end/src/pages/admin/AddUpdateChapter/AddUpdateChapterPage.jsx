import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { FaTrash, FaExchangeAlt, FaUpload, FaPlus } from 'react-icons/fa';

import { getMangaById } from '../../../api/mangaApi';
import {
  addChapter,
  deleteChapter,
  getImagesByChapterId,
  updateChapter,
} from '../../../api/chapterApi';
import { uploadImage } from '../../../api/uploadApi';

import ConfirmationBox from '../../../components/ConfirmationBox/ConfirmationBox';
import MangaDetail from '../../../components/MangaDetail/MangaDetail';
import FormInput from '../../../components/FormInput/FormInput';

import '../../../components/GenreTable/GenreTable.css';
import './AddUpdateChapterPage.css';

const PAGE_HEADERS = {
  ADD: 'Thêm chương mới',
  EDIT: 'Cập nhật chương',
};

const CONFIRMATION_TYPE = {
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  DELETE_ALL: 'deleteAll',
};

export default function AddUpdateChapterPage() {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();

  const [manga, setManga] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [confirmType, setConfirmType] = useState('');
  const [chapterNumber, setChapterNumber] = useState(0);
  const [chapterData, setChapterData] = useState({
    mangaId: null,
    mangaName: '',
    chapterNumber: null,
    chapterImages: [],
  });

  // Fetch initial data
  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        if (chapterId) {
          const data = await getImagesByChapterId(chapterId);
          setChapterData(data);
          setChapterNumber(data.chapterNumber);

          const mangaData = await getMangaById(data.mangaId);
          setManga(mangaData);
        } else {
          const mangaData = await getMangaById(mangaId);
          setManga(mangaData);
          setChapterNumber(mangaData.numChapters + 1);
        }
      } catch (error) {
        toast.error(error.message);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterData();
  }, [chapterId, mangaId, navigate]);

  // Dropzone configuration
  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const response = await uploadImage(file);
          return {
            pageId: Date.now() + Math.random(),
            file,
            imageUrl: response.imageUrl,
            pageNumber: chapterData.chapterImages.length + 1,
          };
        });

        const newImages = await Promise.all(uploadPromises);
        setChapterData((prev) => ({
          ...prev,
          chapterImages: [...prev.chapterImages, ...newImages],
        }));
      } catch (error) {
        toast.error('Lỗi khi tải ảnh lên: ' + error.message);
      }
    },
    [chapterData.chapterImages.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  });

  // Image handlers
  const handleDelete = (pageId) => {
    setChapterData((prev) => {
      const newImages = prev.chapterImages.filter((img) => img.pageId !== pageId);
      const updatedImages = newImages.map((img, index) => ({
        ...img,
        pageNumber: index + 1,
      }));
      return {
        ...prev,
        chapterImages: updatedImages,
      };
    });
  };

  const handleDeleteAll = () => {
    setConfirmType(CONFIRMATION_TYPE.DELETE_ALL);
    setShowConfirmBox(true);
  };

  const handleChange = async (pageId, newFile) => {
    try {
      const response = await uploadImage(newFile);
      setChapterData((prev) => ({
        ...prev,
        chapterImages: prev.chapterImages.map((img) =>
          img.pageId === pageId
            ? {
                ...img,
                file: newFile,
                imageUrl: response.imageUrl,
              }
            : img
        ),
      }));
    } catch (error) {
      toast.error('Lỗi khi thay đổi ảnh: ' + error.message);
    }
  };

  const handleFileChange = (event, pageId) => {
    const file = event.target.files[0];
    if (file) {
      handleChange(pageId, file);
    }
  };

  // Chapter action handlers
  const handleAddChapter = () => {
    setConfirmType(CONFIRMATION_TYPE.ADD);
    setShowConfirmBox(true);
  };

  const handleUpdateChapter = () => {
    setConfirmType(CONFIRMATION_TYPE.UPDATE);
    setShowConfirmBox(true);
  };

  const handleDeleteChapter = () => {
    setConfirmType(CONFIRMATION_TYPE.DELETE);
    setShowConfirmBox(true);
  };

  const validateChapter = () => {
    if (chapterData.chapterImages.length == 0) {
      toast.error('Chưa có ảnh nào được tải lên cho chương này!');
      return false;
    }
    return true;
  };

  // API calls
  const addChapterAction = async () => {
    if (!validateChapter()) return;
    try {
      const imageUrls = chapterData.chapterImages.map((img) => img.imageUrl);
      await addChapter(mangaId, chapterNumber, imageUrls);
      toast.success('Chương đã được thêm thành công');
      navigate(`/admin/manga/${mangaId}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateChapterAction = async () => {
    if (!validateChapter()) return;
    try {
      const imageUrls = chapterData.chapterImages.map((img) => img.imageUrl);
      await updateChapter(chapterId, chapterNumber, imageUrls);
      toast.success('Chương đã được cập nhật thành công');
      navigate(`/admin/manga/${chapterData.mangaId}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteChapterAction = async () => {
    try {
      await deleteChapter(chapterId);
      toast.success('Chương đã được xóa thành công');
      navigate(`/admin/manga/${chapterData.mangaId}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAllImagesAction = () => {
    setChapterData((prev) => ({
      ...prev,
      chapterImages: [],
    }));
  };

  // Confirmation box handlers
  const handleConfirm = () => {
    switch (confirmType) {
      case CONFIRMATION_TYPE.ADD:
        addChapterAction();
        break;
      case CONFIRMATION_TYPE.UPDATE:
        updateChapterAction();
        break;
      case CONFIRMATION_TYPE.DELETE:
        deleteChapterAction();
        break;
      case CONFIRMATION_TYPE.DELETE_ALL:
        deleteAllImagesAction();
        break;
      default:
        break;
    }
    setShowConfirmBox(false);
  };

  const getConfirmationMessage = () => {
    switch (confirmType) {
      case CONFIRMATION_TYPE.ADD:
        return 'Bạn có chắc chắn muốn thêm chương mới?';
      case CONFIRMATION_TYPE.UPDATE:
        return 'Bạn có chắc chắn muốn cập nhật chương này?';
      case CONFIRMATION_TYPE.DELETE:
        return 'Bạn có chắc chắn muốn xóa chương này?';
      case CONFIRMATION_TYPE.DELETE_ALL:
        return 'Bạn có chắc chắn muốn xóa tất cả ảnh?';
      default:
        return '';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='page__container'>
      <MangaDetail manga={manga} isAdmin={true} />

      <div className='page__header'>
        <h2>{chapterId ? PAGE_HEADERS.EDIT : PAGE_HEADERS.ADD}</h2>
      </div>

      <div className='form-input__row'>
        <div className='info-label'>
          <label>Chương: </label>
        </div>
        <FormInput
          type='number'
          placeholder='Nhập số chương...'
          value={chapterNumber}
          onChange={(e) => setChapterNumber(e.target.value)}
          required={true}
        />
      </div>

      {/* Dropzone */}
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <FaUpload className='upload-icon' />
        <p>Kéo và thả hình ảnh vào đây, hoặc nhấp để chọn tệp</p>
        <p>(Thứ tự ảnh sẽ được sắp xếp theo thứ tự tên tệp)</p>
      </div>

      {/* Action Buttons */}
      <div className='table-actions'>
        <button className='function-button delete-all-button' onClick={handleDeleteAll}>
          <FaTrash /> Xóa tất cả
        </button>
        {!chapterId && (
          <button className='function-button add-button' onClick={handleAddChapter}>
            <FaPlus /> Thêm chương
          </button>
        )}
        {chapterId && (
          <>
            <button
              className='function-button update-button'
              onClick={handleUpdateChapter}
            >
              <FaExchangeAlt /> Cập nhật
            </button>
            <button
              className='function-button delete-button'
              onClick={handleDeleteChapter}
            >
              <FaTrash /> Xoá chương
            </button>
          </>
        )}
      </div>

      {/* Images Table */}
      {chapterData.chapterImages.length > 0 && (
        <div className='images-table-container'>
          <table className='images-table'>
            <thead>
              <tr>
                <th>Trang</th>
                <th>Ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {chapterData.chapterImages.map((image) => (
                <tr key={image.pageId}>
                  <td>{image.pageNumber}</td>
                  <td>
                    <img
                      src={image.imageUrl}
                      alt={`Page ${image.pageNumber}`}
                      className='preview-image'
                    />
                  </td>
                  <td>
                    <div className='action-buttons'>
                      <label className='change-button'>
                        <input
                          type='file'
                          accept='image/*'
                          onChange={(e) => handleFileChange(e, image.pageId)}
                          style={{ display: 'none' }}
                        />
                        <FaExchangeAlt />
                      </label>
                      <button
                        className='delete-button'
                        onClick={() => handleDelete(image.pageId)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Box */}
      {showConfirmBox && (
        <ConfirmationBox
          title='Xác nhận'
          message={getConfirmationMessage()}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmBox(false)}
        />
      )}
    </div>
  );
}
