// components/ConfirmationBox/ConfirmationBox.jsx
import './ConfirmationBox.css';

export default function ConfirmationBox({ title, message, onConfirm, onCancel }) {
  return (
    <div className='confirmation-overlay'>
      <div className='confirmation-box'>
        <h2>{title ? title : 'Xác nhận'}</h2>
        <p>{message}</p>
        <div className='btn-group'>
          <button className='yes-btn' onClick={onConfirm}>
            Xác nhận
          </button>
          <button className='no-btn' onClick={onCancel}>
            Huỷ
          </button>
        </div>
      </div>
    </div>
  );
}
