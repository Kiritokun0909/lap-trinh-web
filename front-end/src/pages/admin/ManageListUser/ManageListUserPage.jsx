import { useEffect, useState } from 'react';
import Pagination from '../../../components/Pagination/Pagination';
import UserTable from '../../../components/UserTable/UserTable';
import { getListUser, toggleBlockUser } from '../../../api/adminApi';
import HandleCode from '../../../utils/HandleCode';

export default function ManageListUserPage() {
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getListUser(currentPage, 5, searchQuery);
      setUsers(response.items);
      setTotalPages(response.totalPages);
    };
    fetchUsers();
  }, [currentPage, searchQuery]);

  const handleBlockUser = async (userId) => {
    try {
      await toggleBlockUser(userId);
      setUsers(
        users.map((user) =>
          user.userId === userId
            ? { ...user, status: HandleCode.ACCOUNT_STATUS_BLOCKED }
            : user
        )
      );
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await toggleBlockUser(userId);
      setUsers(
        users.map((user) =>
          user.userId === userId
            ? { ...user, status: HandleCode.ACCOUNT_STATUS_ACTIVE }
            : user
        )
      );
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  return (
    <div className='page__container'>
      <div className='page__header'>
        <h1>Quản lý danh sách người dùng</h1>
      </div>

      <div className='page__function'>
        <div className='search-input'>
          <input
            type='text'
            placeholder='Tìm kiếm người dùng'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <UserTable
        users={users}
        onBlockUser={handleBlockUser}
        onUnblockUser={handleUnblockUser}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
