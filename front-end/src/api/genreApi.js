import axiosClient from './axiosClient';
import { handleApiError } from '../utils/errorHandler';

const GET_GENRES_URL = '/genres';
const ADD_GENRE_URL = '/genres';
const UPDATE_GENRE_URL = '/genres';
const DELETE_GENRE_URL = '/genres';

//#region get-genre
export const getGenres = async () => {
  try {
    const response = await axiosClient.get(GET_GENRES_URL);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
//#endregion

//#region add-new-genre
export const addGenre = async (genreName) => {
  try {
    const response = await axiosClient.post(ADD_GENRE_URL, {
      genreName: genreName,
    });

    return response.data;
  } catch (err) {
    handleApiError(err, {
      400: 'Đã có tên thể loại này, vui lòng đặt tên khác và thử lại.',
    });
  }
};
//#endregion

//#region update-genre
export const updateGenre = async (genreId, newGenreName) => {
  try {
    const response = await axiosClient.put(`${UPDATE_GENRE_URL}/${genreId}`, {
      genreName: newGenreName,
    });

    return response.data;
  } catch (err) {
    handleApiError(err, {
      400: 'Đã có tên thể loại này, vui lòng đặt tên khác và thử lại.',
    });
  }
};
//#endregion

//#region delete-genre
export const deleteGenre = async (genreIds) => {
  try {
    const responses = await Promise.all(
      genreIds.map((genreId) => axiosClient.delete(`${DELETE_GENRE_URL}/${genreId}`))
    );

    return responses.data;
  } catch (err) {
    handleApiError(err, {
      404: 'Không tìm thấy thể loại này.',
    });
  }
};
//#endregion
