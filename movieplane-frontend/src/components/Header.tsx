


const Header: React.FC = () => {
    return (
        <header className="header">
            <nav className="navbar">
                <div className="navbar-brand">
                    <a href="/">MoviePlane</a>
                </div>
                <ul className="navbar-menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/register">Register</a></li>
                </ul>
            </nav>
        </header>
    );
}
export default Header;