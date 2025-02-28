import axiosClient from "./axiosClient";

//#region get-genre
export const getGenres = async () => {
  try {
    const response = await axiosClient.get(`/genres`);
    return response.data;
  } catch (error) {
    console.error("Error fetching list genre:", error);
  }
};
//#endregion
