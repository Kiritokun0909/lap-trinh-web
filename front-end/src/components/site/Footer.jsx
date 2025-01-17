import { Link } from "react-router-dom";
import "../../styles/site/Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="social-links">
          <Link to="/privacy">Chính sách & điều khoản</Link> |
          <Link to="/about">Giới thiệu</Link>
        </div>

        <div className="personal-info">
          <p>Ho Duc Hoang - N20DCCN018</p>
          <p>Nguyen Duc Huy - N20DCCN021</p>
        </div>
      </div>
    </footer>
  );
}
