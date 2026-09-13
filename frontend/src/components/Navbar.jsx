import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container navbar">

        {/* LOGO */}
        <NavLink
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <span className="brand-mark">U</span>

          <span className="brand-text">
            <strong>UNI CAMPUS</strong>
            <small>Your Digital Campus Companion</small>
          </span>
        </NavLink>


        {/* DESKTOP NAVIGATION */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>

          <NavLink
            to="/"
            end
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/lost-found"
            onClick={closeMenu}
          >
            Lost &amp; Found
          </NavLink>

          <NavLink
            to="/societies"
            onClick={closeMenu}
          >
            Societies
          </NavLink>

          <NavLink
            to="/campus-map"
            onClick={closeMenu}
          >
            Campus Map
          </NavLink>

          <NavLink
            to="/professors"
            onClick={closeMenu}
          >
            Professors
          </NavLink>

          <NavLink
            to="/calendar"
            onClick={closeMenu}
          >
            Calendar
          </NavLink>

          <NavLink
            to="/campus-info"
            onClick={closeMenu}
          >
            Campus Info
          </NavLink>

        </nav>


        {/* LOGIN */}
        <button
          className="login-btn"
          onClick={() => {
            alert("Login will be connected to the backend later.");
          }}
        >
          Login
        </button>


        {/* MOBILE MENU */}
        <button
          className={`menu-toggle ${
            menuOpen ? "active" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;