import { Link } from "react-router-dom";

function Home() {
  return (
    <main>

      {/* HERO */}
      <section className="home-hero">
        <div className="container home-hero-grid">

          <div className="home-hero-content">

            <span className="badge">
              YOUR DIGITAL CAMPUS COMPANION
            </span>

            <h1>
              Everything you need.
              <span> One campus.</span>
            </h1>

            <p>
              UNI CAMPUS brings essential campus services,
              information and student resources together
              in one simple platform.
            </p>

            <div className="home-hero-actions">

              <Link
                to="/campus-map"
                className="btn primary"
              >
                Explore Campus
              </Link>

              <Link
                to="/lost-found"
                className="btn secondary"
              >
                Lost &amp; Found
              </Link>

            </div>

          </div>


          {/* HERO CARD */}
          <div className="home-dashboard-card">

            <div className="dashboard-header">

              <div>
                <span>UNI CAMPUS</span>
                <strong>Campus Dashboard</strong>
              </div>

              <div className="dashboard-dot"></div>

            </div>


            <div className="dashboard-grid">

              <Link
                to="/lost-found"
                className="dashboard-item"
              >
                <div className="dashboard-icon">⌕</div>

                <strong>Lost &amp; Found</strong>

                <span>
                  Report and find items
                </span>
              </Link>


              <Link
                to="/professors"
                className="dashboard-item"
              >
                <div className="dashboard-icon">✦</div>

                <strong>Professors</strong>

                <span>
                  Find faculty cabins
                </span>
              </Link>


              <Link
                to="/calendar"
                className="dashboard-item"
              >
                <div className="dashboard-icon">▣</div>

                <strong>Calendar</strong>

                <span>
                  Important academic dates
                </span>
              </Link>


              <Link
                to="/societies"
                className="dashboard-item"
              >
                <div className="dashboard-icon">★</div>

                <strong>Societies</strong>

                <span>
                  Discover communities
                </span>
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* FEATURES */}
      <section className="section home-features">

        <div className="container">

          <div className="section-heading">

            <span className="badge">
              CAMPUS AT YOUR FINGERTIPS
            </span>

            <h2>
              Everything in one place.
            </h2>

            <p>
              Quickly access the tools and information
              you use throughout your campus life.
            </p>

          </div>


          <div className="home-feature-grid">

            <Link
              to="/lost-found"
              className="home-feature-card"
            >
              <span className="home-feature-icon">⌕</span>

              <span className="home-feature-tag">
                STUDENT SERVICES
              </span>

              <h3>Lost &amp; Found</h3>

              <p>
                Report lost items, submit found items
                and help reconnect belongings with
                their owners.
              </p>

              <span className="home-feature-link">
                Report an item →
              </span>
            </Link>


            <Link
              to="/professors"
              className="home-feature-card"
            >
              <span className="home-feature-icon">✦</span>

              <span className="home-feature-tag">
                FACULTY
              </span>

              <h3>Professor Directory</h3>

              <p>
                Search professors by name, department
                or subject and find their cabin details.
              </p>

              <span className="home-feature-link">
                Find a professor →
              </span>
            </Link>


            <Link
              to="/campus-map"
              className="home-feature-card"
            >
              <span className="home-feature-icon">+</span>

              <span className="home-feature-tag">
                NAVIGATION
              </span>

              <h3>Campus Map</h3>

              <p>
                Explore important campus buildings,
                facilities and student spaces.
              </p>

              <span className="home-feature-link">
                Explore map →
              </span>
            </Link>


            <Link
              to="/calendar"
              className="home-feature-card"
            >
              <span className="home-feature-icon">▣</span>

              <span className="home-feature-tag">
                ACADEMICS
              </span>

              <h3>Academic Calendar</h3>

              <p>
                Keep track of examinations, holidays,
                registration and important academic dates.
              </p>

              <span className="home-feature-link">
                View calendar →
              </span>
            </Link>


            <Link
              to="/societies"
              className="home-feature-card"
            >
              <span className="home-feature-icon">★</span>

              <span className="home-feature-tag">
                COMMUNITY
              </span>

              <h3>Societies</h3>

              <p>
                Discover technical, cultural and sports
                communities across campus.
              </p>

              <span className="home-feature-link">
                Explore societies →
              </span>
            </Link>


            <Link
              to="/campus-info"
              className="home-feature-card"
            >
              <span className="home-feature-icon">ℹ</span>

              <span className="home-feature-tag">
                CAMPUS
              </span>

              <h3>Campus Information</h3>

              <p>
                Learn about campus facilities, services,
                student spaces and everyday campus life.
              </p>

              <span className="home-feature-link">
                Explore campus →
              </span>
            </Link>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="section home-cta">

        <div className="container">

          <div className="home-cta-card">

            <div>

              <span className="badge">
                UNI CAMPUS
              </span>

              <h2>
                Your campus,
                <br />
                simplified.
              </h2>

              <p>
                Find information faster, stay organized
                and make campus life easier.
              </p>

            </div>

            <Link
              to="/campus-info"
              className="btn primary"
            >
              Explore Campus
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;