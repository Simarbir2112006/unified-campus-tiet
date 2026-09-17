import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProfessor } from "../api/professors";

const LINK_LABELS = {
  google_scholar_url: "Google Scholar",
  personal_website_url: "Personal Website",
  linkedin_url: "LinkedIn",
};

function initialsFor(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfessorProfile() {
  const { id } = useParams();

  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfessor() {
      setLoading(true);
      setNotFound(false);
      setError(null);

      try {
        const data = await fetchProfessor(id);
        if (cancelled) return;

        if (data === null) {
          setNotFound(true);
        } else {
          setProfessor(data);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load this professor's profile. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfessor();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main>
        <section className="page-hero">
          <div className="container">
            <span className="badge">FACULTY DIRECTORY</span>
            <h1>Loading professor…</h1>
          </div>
        </section>
      </main>
    );
  }

  if (notFound || error) {
    return (
      <main>
        <section className="page-hero">
          <div className="container">
            <span className="badge">FACULTY DIRECTORY</span>

            <h1>
              {notFound ? "Professor not found" : "Something went wrong"}
            </h1>

            <p>
              {notFound
                ? "This professor profile doesn't exist or may have been removed."
                : error}
            </p>

            <Link to="/professors" className="btn primary">
              ← Back to Professors
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const links = [
    ...Object.entries(LINK_LABELS)
      .filter(([field]) => professor[field])
      .map(([field, label]) => ({ label, url: professor[field] })),
    ...(professor.other_links || [])
      .filter((link) => link && link.url)
      .map((link) => ({ label: link.label || "Link", url: link.url })),
  ];

  return (
    <main>

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">FACULTY DIRECTORY</span>

          <h1>{professor.name}</h1>

          <p>
            {professor.designation} · {professor.department}
          </p>
        </div>
      </section>

      {/* PROFILE */}
      <section className="section professors-section">
        <div className="container">

          <Link to="/professors" className="profile-back-link">
            ← Back to all professors
          </Link>

          <div className="professor-card profile-card">

            <div className="professor-top">

              <div className="professor-avatar">
                {initialsFor(professor.name)}
              </div>

              <div className="professor-title">
                <h2>{professor.name}</h2>
                <span>{professor.designation}</span>
              </div>

            </div>

            <div className="professor-department">
              {professor.department}
            </div>

            <div className="professor-details">

              <div className="professor-detail">
                <span className="detail-icon">✉</span>

                <div>
                  <small>Official Email</small>
                  <a href={`mailto:${professor.official_email}`}>
                    {professor.official_email}
                  </a>
                </div>
              </div>

              {professor.phone && (
                <div className="professor-detail">
                  <span className="detail-icon">☎</span>

                  <div>
                    <small>Phone</small>
                    <strong>{professor.phone}</strong>
                  </div>
                </div>
              )}

              {professor.cabin && (
                <div className="professor-detail">
                  <span className="detail-icon">+</span>

                  <div>
                    <small>Cabin / Office</small>
                    <strong>{professor.cabin}</strong>
                    <small>Interactive campus map integration is coming soon.</small>
                  </div>
                </div>
              )}

              {professor.subjects && (
                <div className="professor-detail">
                  <span className="detail-icon">◈</span>

                  <div>
                    <small>Subjects</small>
                    <strong>{professor.subjects}</strong>
                  </div>
                </div>
              )}

            </div>

            {links.length > 0 && (
              <div className="profile-links">
                {links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn secondary"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}

          </div>

        </div>
      </section>

    </main>
  );
}

export default ProfessorProfile;
