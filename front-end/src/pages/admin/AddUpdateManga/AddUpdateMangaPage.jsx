import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBook, FaPen, FaPlus, FaRss, FaTag, FaUser } from 'react-icons/fa';

import { uploadImage } from '../../../api/uploadApi';
import { getAuthors } from '../../../api/authorApi';
import { getGenres } from '../../../api/genreApi';
import { createManga, getMangaById, updateManga } from '../../../api/mangaApi';

import FormInput from '../../../components/FormInput/FormInput';

import { DEFAULT_AUTHOR_IMAGE_URL, DEFAULT_COVER_IMAGE_URL } from '../../../utils/utils';

import './AddUpdateMangaPage.css';
import '../../site/MangaPage/MangaPage.css';

const ADD_HEADER = 'Thêm truyện mới';
const EDIT_HEADER = 'Cập nhật thông tin truyện';

function InputInfoRow({
  type = 'text',
  icon,
  label,
  value,
  placeholder,
  setValue,
  isRequired = false,
}) {
  return (
    <div className='form-input__row'>
      <div className='info-label'>
        <div className='info-icon'>{icon || ''}</div>
        {label && <label>{label}</label>}
      </div>
      <FormInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={isRequired}
      />
    </div>
  );
}

function GenreList({ genres, selectedGenres, setSelectedGenres }) {
  const handleSelectChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGenres((prev) =>
      checked ? [...prev, value] : prev.filter((genreId) => genreId !== value)
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all genres
      const allGenreIds = genres.map((genre) => genre.genreId.toString());
      setSelectedGenres(allGenreIds);
    } else {
      // Deselect all genres
      setSelectedGenres([]);
    }
  };

  return (
    <div className='manga-genres'>
      <div className='form-input__row'>
        <div className='info-label'>
          <div className='info-icon'>
            <FaTag />
          </div>
          <label>Thể loại:</label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label>
            <input
              type='checkbox'
              onChange={handleSelectAll}
              checked={selectedGenres?.length === genres?.length}
            />
            Chọn tất cả
          </label>
          <div className='manga-genres__list'>
            {genres &&
              genres.length > 0 &&
              genres.map((genre) => (
                <label key={genre.genreId}>
                  <input
                    type='checkbox'
                    value={genre.genreId}
                    checked={selectedGenres.includes(String(genre.genreId))}
                    onChange={handleSelectChange}
                  />
                  {genre.genreName}
                </label>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddUpdateMangaPage() {
  const mangaId = parseInt(useParams().mangaId);
  const isAdd = mangaId === 0;

  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [mangaName, setMangaName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [ageLimit, setAgeLimit] = useState('');
  const [description, setDescription] = useState('');

  const [author, setAuthor] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [searchAuthorName, setSearchAuthorName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchManga = async () => {
      try {
        const data = await getMangaById(mangaId);
        setMangaName(data.mangaName);
        setOtherName(data.otherName);
        setPublishedYear(data.publishedYear);
        setAgeLimit(data.ageLimit);
        setDescription(data.description);
        setCoverImageUrl(data.coverImageUrl);
        setAuthor(data.author);
        setSelectedGenres(data.genres.map((genre) => genre.genreId.toString()));
      } catch (error) {
        console.log(error);
      }
    };

    if (!isAdd) {
      fetchManga();
    }

    fetchGenres();
  }, [isAdd, mangaId]);

  useEffect(() => {
    const fetchSearchResult = async () => {
      if (searchAuthorName === '') {
        setSearchResult([]);
        return;
      }

      try {
        const data = await getAuthors(searchAuthorName, 1, 5);
        setSearchResult(data.items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSearchResult();
  }, [searchAuthorName]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);

    try {
      const data = await uploadImage(file);
      setCoverImageUrl(data.imageUrl);
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

  const handleAuthorClick = (author) => {
    setAuthor(author);
    setSearchAuthorName(author.authorName);
    setIsSearching(false);
  };

  const validateManga = (manga) => {
    if (!manga.mangaName) {
      toast.error('Không được để trống tên truyện.  ');
      return false;
    }

    return true;
  };

  const handleAddManga = async (e) => {
    e.preventDefault();

    const newManga = {
      coverImageUrl,
      mangaName,
      otherName,
      publishedYear,
      description,
      ageLimit,
      author,
      genres: selectedGenres,
    };

    if (!validateManga(newManga)) return;
    // console.log('>>> newManga: ', newManga);
    // console.log('>>> selectedGenres: ', selectedGenres);
    try {
      const response = await createManga(newManga);
      console.log('>>response: ', response);
      toast.success('Thêm truyện thành công!');
      navigate('/admin/manga/' + response.mangaId);
    } catch (err) {}

    // onAdd(newManga);
  };

  const handleUpdateManga = async (e) => {
    e.preventDefault();

    const updatedManga = {
      mangaId: mangaId,
      coverImageUrl,
      mangaName,
      otherName,
      publishedYear,
      description,
      ageLimit,
      author,
      genres: selectedGenres,
    };

    if (!validateManga(updatedManga)) return;
    // console.log(updatedManga);
    try {
      const response = await updateManga(updatedManga);
      console.log('>>response: ', response);
      toast.success('Chỉnh sửa truyện thành công!');
      navigate('/admin/manga/' + mangaId);
    } catch (err) {}
  };

  const handleCancel = () => {
    navigate('/admin/manga/' + mangaId);
  };

  return (
    <div className='page__container'>
      <div className='page__header'>
        <h2 style={{ margin: '8px' }}>{isAdd ? ADD_HEADER : EDIT_HEADER}</h2>
      </div>

      <div className='manga-content'>
        <div className='form-input-image__row'>
          {isLoading ? (
            <div className='loading-spinner'>Đang tải lên...</div>
          ) : (
            <img
              className='avatar'
              src={coverImageUrl || DEFAULT_COVER_IMAGE_URL}
              alt='Avatar'
              style={{ width: '158px', height: '216px' }}
            />
          )}
          <div>
            <input
              id='avatarUpload'
              type='file'
              style={{ display: 'none' }}
              accept='image/*'
              onChange={handleImageChange}
            />

            <button type='button' onClick={handleButtonClick} className='change-image'>
              Chọn ảnh
            </button>
          </div>
        </div>

        <InputInfoRow
          icon={<FaBook />}
          label='Tên truyện (*):'
          value={mangaName}
          placeholder='Nhập tên truyện...'
          setValue={setMangaName}
          isRequired={true}
        />

        <InputInfoRow
          icon={<FaPlus />}
          label='Tên khác:'
          value={otherName}
          placeholder='Nhập tên khác của truyện...'
          setValue={setOtherName}
        />

        <div className='form-input__row'>
          <div className='info-label'>
            <div className='info-icon'>
              <FaUser />
            </div>
            <label>Tác giả:</label>
          </div>
          <div className='search-bar__search'>
            <div className='form-input'>
              <input
                type='text'
                placeholder='Nhập tác giả...'
                value={searchAuthorName}
                onChange={(e) => setSearchAuthorName(e.target.value)}
                onFocus={() => setIsSearching(true)}
              />
            </div>

            {isSearching && searchResult.length > 0 && (
              <div className='search-result search-result__author'>
                {searchResult.map((author) => (
                  <Link
                    key={author.authorId}
                    to='#'
                    onClick={() => handleAuthorClick(author)}
                  >
                    <div className='search-item'>
                      <img
                        src={author.avatar || DEFAULT_AUTHOR_IMAGE_URL}
                        alt={author.authorName}
                        className='search-item__cover'
                      />
                      <div className='search-item__info'>
                        <div className='search-item__info-row'>{author.authorName}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <InputInfoRow
          icon={<FaRss />}
          label='Năm phát hành:'
          value={publishedYear}
          placeholder='Nhập năm phát hành...'
          setValue={setPublishedYear}
          type='number'
        />

        <InputInfoRow
          icon={<FaPlus />}
          label='Độ tuổi:'
          value={ageLimit}
          placeholder='Nhập độ tuổi...'
          setValue={setAgeLimit}
          type='number'
        />

        <div className='form-input__row'>
          <div className='info-label'>
            <div className='info-icon'>
              <FaPen />
            </div>
            <label>Mô tả:</label>
          </div>
          <textarea
            placeholder='Nhập mô tả...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <GenreList
        genres={genres}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />

      <div className='modal-button'>
        <button
          type='submit'
          className='accept-button'
          onClick={isAdd ? handleAddManga : handleUpdateManga}
        >
          {isAdd ? 'Thêm' : 'Cập nhật'}
        </button>

        <button type='button' className='cancel-button' onClick={handleCancel}>
          Huỷ
        </button>
      </div>
    </div>
  );
}
