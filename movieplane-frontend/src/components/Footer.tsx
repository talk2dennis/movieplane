import './css/Footer.css';
import { useNavigate } from 'react-router-dom';


const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} MoviePlane. All rights reserved.</p>
        <nav className="footer-links">
          <span onClick={() => navigate('/about')} role="button" tabIndex={0} className="footer-link" aria-label="About">About</span>
          <span className="footer-separator">|</span>
          <span onClick={() => navigate('/contact')} role="button" tabIndex={0} className="footer-link" aria-label="Contact" >Contact</span>
          <span className="footer-separator">|</span>
          <span onClick={() => navigate('/privacy')} role="button" tabIndex={0} className="footer-link" aria-label="Privacy Policy" >Privacy</span>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;