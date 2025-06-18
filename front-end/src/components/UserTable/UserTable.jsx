import React from 'react';
import './UserTable.css';
import { DEFAULT_AUTHOR_IMAGE_URL } from '../../utils/utils';
import HandleCode from '../../utils/HandleCode';

const UserTable = ({ users, onBlockUser, onUnblockUser }) => {
  return (
    <div className='user-table-container'>
      <table className='user-table'>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>
                <div className='user-avatar'>
                  <img
                    src={user.avatar || DEFAULT_AUTHOR_IMAGE_URL}
                    alt={`${user.username}'s avatar`}
                  />
                </div>
              </td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>
                <div className='action-buttons'>
                  {user.status === HandleCode.ACCOUNT_STATUS_BLOCKED ? (
                    <button
                      className='unblock-btn'
                      onClick={() => onUnblockUser(user.userId)}
                    >
                      Mở khoá
                    </button>
                  ) : (
                    <button
                      className='block-btn'
                      onClick={() => onBlockUser(user.userId)}
                    >
                      Khoá
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
