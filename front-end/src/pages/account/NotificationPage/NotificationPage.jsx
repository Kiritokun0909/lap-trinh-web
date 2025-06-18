import { useEffect, useState } from 'react';
import { getNotifications, readNotification } from '../../../api/userApi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../../../components/Pagination/Pagination';
import './NotificationPage.css';
import { formatDate } from '../../../utils/utils';

const PAGE_TITLE = 'Thông báo';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications(currentPage, ITEMS_PER_PAGE);
        setNotifications(response.notifications);
        setTotalPages(response.totalPages);
      } catch (error) {
        toast.error(error.message);
      }
    };

    document.title = PAGE_TITLE;
    fetchNotifications();
  }, [currentPage]);

  const handleClickNotification = async (notificationId) => {
    try {
      await readNotification(notificationId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='like-page__container'>
      <div className='like-page__header'>
        <h2>Thông báo</h2>
      </div>

      {notifications.map((notice) => (
        <Link
          to={`/manga/${notice.mangaId}`}
          key={notice.notificationId}
          className='notification-link'
          onClick={(e) => {
            e.preventDefault(); // Prevent immediate navigation
            handleClickNotification(notice.notificationId).then(() => {
              // Navigate after marking notification as read
              navigate(`/manga/${notice.mangaId}`);
            });
          }}
        >
          <div className={`notification-item ${notice.isRead === 1 ? 'read' : ''}`}>
            <div>
              <img src={notice.coverImageUrl} alt='' className='notification-image' />
            </div>
            <div className='notification-content'>
              <div>{notice.mangaName} vừa đăng chương mới</div>
              <div>{formatDate(notice.createAt)}</div>
            </div>
          </div>
        </Link>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
