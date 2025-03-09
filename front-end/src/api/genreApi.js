import axiosClient from "./axiosClient";

const GET_GENRES_URL = "/genres";

//#region get-genre
export const getGenres = async () => {
  try {
    const response = await axiosClient.get(GET_GENRES_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching list genre:", error);
  }
};
//#endregion
