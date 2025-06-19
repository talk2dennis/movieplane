import './css/Footer.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} MoviePlane. All rights reserved.</p>
        <p>
          <a href="/about">About</a> | <a href="/contact">Contact</a> | <a href="/privacy">Privacy</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;