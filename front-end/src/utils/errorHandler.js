export const handleApiError = (error, customMessages = {}) => {
  if (!error?.response) {
    throw new Error('Hệ thống không phản hồi.');
  }

  const { status } = error.response;

  if (customMessages[status]) {
    throw new Error(customMessages[status]);
  }

  // Default error messages based on status
  const defaultMessages = {
    400: 'Yêu cầu không hợp lệ.',
    401: 'Phiên đăng nhập đã hết hạn.',
    403: 'Bạn không có quyền thực hiện thao tác này.',
    404: 'Không tìm thấy dữ liệu.',
    409: 'Dữ liệu đã tồn tại.',
    500: 'Lỗi hệ thống, vui lòng thử lại sau.',
  };

  throw new Error(defaultMessages[status] || 'Lỗi hệ thống, vui lòng thử lại sau.');
};
