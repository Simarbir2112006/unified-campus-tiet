import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDepartments, fetchProfessors } from "../api/professors";

function initialsFor(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Professors() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [departments, setDepartments] = useState(["All"]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments()
      .then((data) => setDepartments(["All", ...data]))
      .catch(() => {
        // Department list is a secondary enhancement; keep default "All" only.
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);

      fetchProfessors({ search, department })
        .then(setProfessors)
        .catch(() => setError("Could not load professors. Please try again."))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, department]);

  return (
    <main>

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">FACULTY DIRECTORY</span>

          <h1>Find your professor.</h1>

          <p>
            Search faculty members, departments, subjects and
            cabin locations across campus.
          </p>
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="section professors-section">
        <div className="container">

          <div className="professor-controls">

            <div className="professor-search">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search professors, departments or subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="professor-filter">
              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              >
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* RESULTS COUNT */}
          {!loading && !error && (
            <div className="professor-results">
              <span>
                {professors.length} professor
                {professors.length !== 1 ? "s" : ""} found
              </span>
            </div>
          )}

          {/* PROFESSOR CARDS */}
          {loading ? (

            <div className="professor-empty">
              <h2>Loading professors…</h2>
            </div>

          ) : error ? (

            <div className="professor-empty">
              <div className="empty-icon">⌕</div>
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>

          ) : professors.length > 0 ? (

            <div className="professor-grid">

              {professors.map((professor) => (

                <Link
                  to={`/professors/${professor.id}`}
                  className="professor-card"
                  key={professor.id}
                >

                  <div className="professor-top">

                    <div className="professor-avatar">
                      {initialsFor(professor.name)}
                    </div>

                    <div className="professor-title">

                      <h2>{professor.name}</h2>

                      <span>
                        {professor.designation}
                      </span>

                    </div>

                  </div>

                  <div className="professor-department">
                    {professor.department}
                  </div>

                  <div className="professor-details">

                    <div className="professor-detail">
                      <span className="detail-icon">
                        ✉
                      </span>

                      <div>
                        <small>Email</small>
                        <strong>
                          {professor.official_email}
                        </strong>
                      </div>
                    </div>

                    {professor.cabin && (
                      <div className="professor-detail">
                        <span className="detail-icon">
                          +
                        </span>

                        <div>
                          <small>Cabin</small>
                          <strong>
                            {professor.cabin}
                          </strong>
                        </div>
                      </div>
                    )}

                    {professor.subjects && (
                      <div className="professor-detail">
                        <span className="detail-icon">
                          ◈
                        </span>

                        <div>
                          <small>Subjects</small>
                          <strong>
                            {professor.subjects}
                          </strong>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="professor-direction-btn">
                    View Profile →
                  </div>

                </Link>

              ))}

            </div>

          ) : (

            <div className="professor-empty">

              <div className="empty-icon">
                ⌕
              </div>

              <h2>No professors found</h2>

              <p>
                Try a different professor name,
                department or subject.
              </p>

            </div>

          )}

        </div>
      </section>

    </main>
  );
}

export default Professors;
