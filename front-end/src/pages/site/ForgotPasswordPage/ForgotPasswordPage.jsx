import { useEffect } from 'react';

const PAGE_TITLE = 'Quên mật khẩu';
export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div>
      <h1>Quên mật khẩu</h1>
    </div>
  );
}
