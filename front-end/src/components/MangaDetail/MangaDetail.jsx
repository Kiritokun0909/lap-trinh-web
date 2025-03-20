import {
  FaPlus,
  FaUser,
  FaRss,
  FaExclamationTriangle,
  FaHeart,
  FaTags,
} from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import { DEFAULT_COVER_IMAGE_URL, formatDate } from '../../utils/utils';
import './MangaDetail.css';

function MangaInfoRow({ icon, label, value }) {
  return (
    <div className='info-row'>
      <div className='info-label'>
        <div className='info-icon'>{icon || ''}</div>
        {label && <label>{label}</label>}
      </div>
      <span className='info-value'> {value}</span>
    </div>
  );
}

export default function MangaDetail({ manga }) {
  if (!manga) {
    return <p>Đang tải...</p>;
  }

  return (
    <>
      <div className='manga-title'>
        <h1>{manga.mangaName || 'N/A'}</h1>
      </div>
      <div className='manga-title stats'>
        <MangaInfoRow
          icon={<GrView />}
          value={manga.numViews + ' lượt xem' || 0}
        />
        <MangaInfoRow
          icon={<FaHeart />}
          value={manga.numLikes + ' lượt thích' || 0}
        />
        <MangaInfoRow
          value={
            manga.updateAt
              ? '(Cập nhật khoảng: ' + formatDate(manga.updateAt) + ')'
              : ''
          }
        />
      </div>
      <div className='manga-detail'>
        <div className='manga-cover-image'>
          <img
            src={manga.coverImageUrl || DEFAULT_COVER_IMAGE_URL}
            alt={manga.mangaName || 'No Name'}
          />
        </div>
        <div className='manga-info'>
          <MangaInfoRow
            icon={<FaPlus />}
            label={'Tên khác'}
            value={manga.otherName || 'N/A'}
          />
          <MangaInfoRow
            icon={<FaUser />}
            label={'Tác giả'}
            value={manga.authorName || 'N/A'}
          />
          <MangaInfoRow
            icon={<FaRss />}
            label={'Năm phát hành'}
            value={manga.publishedYear || 'N/A'}
          />
          <MangaInfoRow
            icon={<FaExclamationTriangle />}
            label={'Nội dung'}
            value={manga.ageLimit + '+' || 'N/A'}
          />
          <div className='info-row'>
            <div className='info-label'>
              <div className='info-icon'>{<FaTags /> || ''}</div>
              <label>Thể loại</label>
            </div>
            <div>
              {manga.genres &&
                manga.genres.map((genre) => (
                  <span key={genre.genreId} className='info-value'>
                    {genre.genreName}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
