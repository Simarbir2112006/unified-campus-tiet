import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">

        {/* BRAND */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-mark">U</span>

            <span>
              <strong>UNI CAMPUS</strong>
              <small>Your Digital Campus Companion</small>
            </span>
          </Link>

          <p>
            A unified digital platform designed to make
            campus life simpler, smarter and more connected.
          </p>
        </div>


        {/* CAMPUS */}
        <div className="footer-column">
          <h3>Campus</h3>

          <Link to="/campus-map">Campus Map</Link>
          <Link to="/campus-info">Campus Info</Link>
          <Link to="/professors">Professors</Link>
          <Link to="/calendar">Academic Calendar</Link>
        </div>


        {/* COMMUNITY */}
        <div className="footer-column">
          <h3>Community</h3>

          <Link to="/societies">Societies</Link>
          <Link to="/lost-found">Lost &amp; Found</Link>
        </div>


        {/* PROJECT */}
        <div className="footer-column">
          <h3>UNI CAMPUS</h3>

          <p>
            Your digital companion for everyday
            university life.
          </p>

          <span className="footer-status">
            ● Campus Portal
          </span>
        </div>

      </div>


      <div className="container footer-bottom">

        <span>
          © {new Date().getFullYear()} UNI CAMPUS
        </span>

        <span>
          Built for the campus community
        </span>

      </div>
    </footer>
  );
}

export default Footer;