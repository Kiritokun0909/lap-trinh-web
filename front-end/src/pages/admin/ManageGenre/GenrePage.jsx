import React, { useEffect, useState } from "react";
import { MdOutlineAdd, MdEdit, MdDelete, MdCheck } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { toast } from "react-toastify";

import {
  getGenres,
  addGenre,
  deleteGenre,
  updateGenre,
} from "../../../api/genreApi.js";
import GenreModal from "../../../modals/GenreModal/GenreModal.jsx";
import { capitalizeFirstLetter } from "../../../utils/utils.js";

import "./GenrePage.css";

const PAGE_TITLE = "Quản lý thể loại";

function SearchInput({ searchName, setSearchName }) {
  return (
    <div className="search-input">
      <input
        type="text"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="Nhập thể loại muốn tìm..."
        className="search-input"
      />
    </div>
  );
}

function GenreTable({ genres, searchName, onUpdate, onDelete, openModal }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [editingGenreId, setEditingGenreId] = useState(null);
  const [editedGenreName, setEditedGenreName] = useState("");

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
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleEdit = (genre) => {
    setEditingGenreId(genre.genreId);
    setEditedGenreName(genre.genreName);
  };

  const handleSaveEdit = (genreId) => {
    onUpdate(genreId, editedGenreName);
    setEditingGenreId(null);
  };

  const handleBulkDelete = () => {
    if (selectedGenres.length === 0) return;
    onDelete(selectedGenres);
  };

  return (
    <>
      <div className="buttons-section">
        <button
          className="function-button delete-all-button"
          onClick={handleBulkDelete}
        >
          <IoMdTrash className="add-button-icon" />
          Xóa tất cả đã chọn ({selectedGenres.length})
        </button>
        <button className="function-button add-button" onClick={openModal}>
          <MdOutlineAdd className="add-button-icon" />
          <span>Thêm</span>
        </button>
      </div>

      <div className="list-genres">
        <table className="genre-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
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
              <tr key={genre.genreId} className="genre-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre.genreId)}
                    onChange={() => handleSelectGenre(genre.genreId)}
                  />
                </td>
                <td>
                  {editingGenreId === genre.genreId ? (
                    <input
                      type="text"
                      value={editedGenreName}
                      onChange={(e) => setEditedGenreName(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    genre.genreName
                  )}
                </td>
                <td>
                  {editingGenreId === genre.genreId ? (
                    <button
                      className="finish-button"
                      onClick={() => handleSaveEdit(genre.genreId)}
                    >
                      <MdCheck />
                      Hoàn tất
                    </button>
                  ) : (
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(genre)}
                      >
                        <MdEdit />
                        Cập nhật
                      </button>
                      <button
                        className="delete-button"
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

export default function GenrePage() {
  const [genres, setGenres] = useState([]);
  const [searchName, setSearchName] = useState("");
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
    if (name === "") {
      toast.error("Vui lòng không để trống tên thể loại!");
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
      toast.success("Thêm thể loại mới thành công!");
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
      toast.success("Cập nhật tên thể loại thành công!");

      fetchGenres();
    } catch (err) {
      // console.log(">>err ", err);
      toast.error(err.message);
    }
  };

  const deleteSelectedGenre = async (genreIds) => {
    try {
      await deleteGenre(genreIds);
      toast.success("Xoá thể loại thành công!");

      fetchGenres();
    } catch (err) {
      // console.log(">>err ", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="genres-container">
      {showModal && (
        <GenreModal onSave={addNewGenre} onClose={() => setShowModal(false)} />
      )}

      <h1>{PAGE_TITLE}</h1>

      <SearchInput searchName={searchName} setSearchName={setSearchName} />

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
