import React, { useState } from "react";
import "../../styles/site/LoginPage.css";
import { useAuth } from "../../context/AuthContext.tsx";

const LOGIN_HEADER = "Đăng nhập";
const REGISTER_HEADER = "Đăng ký";
const FORGOT_PASSWORD_TEXT = "Quên mật khẩu?";
const HAVING_ACCOUNT_TEXT = "Đã có tài khoản? Đăng nhập";
const NOT_HAVING_AN_ACCOUNT_TEXT = "Chưa có tài khoản? Đăng ký";

function LoginBox() {
  const AuthContext = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitForm = () => {
    AuthContext.login(email, password);
    return true;
  };

  return (
    <div className="login-box">
      <div className="title">
        <span>{isLogin ? LOGIN_HEADER : REGISTER_HEADER}</span>
      </div>
      <div className="account">
        <div className="email">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="password">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!isLogin && (
          <div className="password">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}
        <button className="submit-btn" onClick={submitForm}>
          {isLogin ? LOGIN_HEADER : REGISTER_HEADER}
        </button>
      </div>
      <div className="other-functions">
        <div className="switch-btn-container">
          <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? NOT_HAVING_AN_ACCOUNT_TEXT : HAVING_ACCOUNT_TEXT}
          </button>
        </div>
        {isLogin && (
          <div className="switch-btn-container">
            <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
              {FORGOT_PASSWORD_TEXT}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const LoginPage = () => {
  return (
    <>
      <div className="login-container">
        <LoginBox />
      </div>
    </>
  );
};
