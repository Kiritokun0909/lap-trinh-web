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

import MangaDetail from '../../../components/MangaDetail/MangaDetail';

import './AddUpdateChapterPage.css';
import FormInput from '../../../components/FormInput/FormInput';

const ADD_HEADER = 'Thêm chương mới';
const EDIT_HEADER = 'Cập nhật chương';

export default function AddUpdateChapterPage() {
  const { mangaId, chapterId } = useParams();

  const [manga, setManga] = useState();

  const [chapterData, setChapterData] = useState({
    mangaId: null,
    mangaName: '',
    chapterNumber: null,
    chapterImages: [],
  });

  const [chapterNumber, setChapterNumber] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapterData = async () => {
      if (chapterId) {
        try {
          const data = await getImagesByChapterId(chapterId);
          setChapterData(data);
          setChapterNumber(data.chapterNumber);

          const mangaData = await getMangaById(data.mangaId);
          setManga(mangaData);

          setIsLoading(false);
        } catch (error) {
          toast.error(error.message);
          navigate('/');
          console.error('Failed to fetch chapter images:', error);
        }
      } else {
        try {
          const mangaData = await getMangaById(mangaId);
          setManga(mangaData);
          setChapterNumber(mangaData.newestChapterNumber + 1);
        } catch (error) {
          toast.error(error.message);
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchChapterData();
  }, [chapterId]);

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

  const handleDelete = (pageId) => {
    setChapterData((prev) => {
      const newImages = prev.chapterImages.filter((img) => img.pageId !== pageId);
      // Update page numbers
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
    setChapterData((prev) => ({
      ...prev,
      chapterImages: [],
    }));
  };

  const handleChange = async (pageId, newFile) => {
    try {
      const response = await uploadImage(newFile);
      setChapterData((prev) => ({
        ...prev,
        chapterImages: prev.chapterImages.map((img) => {
          if (img.pageId === pageId) {
            return {
              ...img,
              file: newFile,
              imageUrl: response.imageUrl,
            };
          }
          return img;
        }),
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

  const handleAddChapter = async () => {
    const imageUrls = chapterData.chapterImages.map((img) => img.imageUrl);

    console.log('>>> imageUrls:', imageUrls);
    console.log('>>> chapterData:', chapterData);
    try {
      await addChapter(mangaId, chapterNumber, imageUrls);
      toast.success('Chương đã được thêm thành công');
      navigate(`/admin/manga/${mangaId}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateChapter = async () => {
    const imageUrls = chapterData.chapterImages.map((img) => img.imageUrl);
    try {
      await updateChapter(chapterId, imageUrls);
      toast.success('Chương đã được cập nhật thành công');
      navigate(`/admin/manga/${chapterData.mangaId}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteChapter = async () => {
    try {
      await deleteChapter(chapterId);
      toast.success('Chương đã được xóa thành công');
      navigate(`/admin/manga/${chapterData.mangaId}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='page__container'>
      <MangaDetail manga={manga} isAdmin={true} />

      <div className='page__header'>
        <h2>{chapterId ? EDIT_HEADER : ADD_HEADER}</h2>
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

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Dropzone */}
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <FaUpload className='upload-icon' />
            <p>Kéo và thả hình ảnh vào đây, hoặc nhấp để chọn tệp</p>
            <p>(Thứ tự ảnh sẽ được sắp xếp theo thứ tự tên tệp)</p>
          </div>

          {/* Images Table */}

          <div className='table-actions'>
            <button className='delete-all-button' onClick={handleDeleteAll}>
              <FaTrash /> Xóa tất cả ảnh
            </button>
            <button className='' onClick={handleAddChapter}>
              <FaPlus /> Thêm chương
            </button>

            <button className='' onClick={handleUpdateChapter}>
              <FaExchangeAlt /> Cập nhật chương
            </button>

            <button className='' onClick={handleDeleteChapter}>
              <FaTrash /> Xoá chương
            </button>
          </div>

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
        </>
      )}
    </div>
  );
}
