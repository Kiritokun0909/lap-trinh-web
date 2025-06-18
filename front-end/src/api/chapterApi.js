import axiosClient from './axiosClient';
import { handleApiError } from '../utils/errorHandler';

//#region get-list-chapter-by-manga-id
export const getListChapterByMangaId = async (mangaId) => {
  try {
    const response = await axiosClient.get(`/mangas/${mangaId}/chapters`);
    return response.data;
  } catch (err) {
    handleApiError(err, {
      404: 'Không tìm thấy truyện.',
    });
  }
};
//#endregion

//#region get-images-by-chapter-id
export const getImagesByChapterId = async (chapterId) => {
  try {
    const response = await axiosClient.get(`/chapters/${chapterId}/images`);
    return response.data;
  } catch (err) {
    handleApiError(err, {
      404: 'Không tìm thấy chương truyện.',
    });
  }
};
//#endregion

//#region add-chapter
export const addChapter = async (mangaId, chapterNumber, imageUrls) => {
  try {
    const response = await axiosClient.post('/chapters/' + mangaId, {
      chapterNumber: chapterNumber,
      chapterImages: imageUrls,
    });
    return response.data;
  } catch (err) {
    handleApiError(err, {
      400: 'Không thể thêm chương.',
    });
  }
};
//#endregion

//#region update-chapter
export const updateChapter = async (chapterId, chapterNumber, imageUrls) => {
  try {
    const response = await axiosClient.put('/chapters/' + chapterId, {
      chapterNumber: chapterNumber,
      chapterImages: imageUrls,
    });
    return response.data;
  } catch (err) {
    handleApiError(err, {
      400: 'Không thể cập nhật chương.',
    });
  }
};
//#endregion

//#region delete-chapter
export const deleteChapter = async (chapterId) => {
  try {
    const response = await axiosClient.delete('/chapters/' + chapterId);
    return response.data;
  } catch (err) {
    handleApiError(err, {
      400: 'Không thể xóa chương.',
    });
  }
};
//#endregion
