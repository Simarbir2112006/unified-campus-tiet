import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchReport, photoUrl } from "../api/lostFound";

function LostFoundDetail() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      setLoading(true);
      setNotFound(false);
      setError(null);

      try {
        const data = await fetchReport(id);
        if (cancelled) return;

        if (data === null) {
          setNotFound(true);
        } else {
          setReport(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load this report. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReport();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main>
        <section className="page-hero">
          <div className="container">
            <span className="badge">CAMPUS LOST & FOUND</span>
            <h1>Loading report…</h1>
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
            <span className="badge">CAMPUS LOST & FOUND</span>

            <h1>{notFound ? "Report not found" : "Something went wrong"}</h1>

            <p>
              {notFound
                ? "This report doesn't exist or may have been removed."
                : error}
            </p>

            <Link to="/lost-found" className="btn primary">
              ← Back to Lost & Found
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">
            {report.type === "LOST" ? "LOST ITEM" : "FOUND ITEM"}
          </span>

          <h1>{report.item_name}</h1>

          <p>{report.location} · {report.date}</p>
        </div>
      </section>

      {/* DETAIL */}
      <section className="section">
        <div className="container">

          <Link to="/lost-found" className="profile-back-link">
            ← Back to Lost & Found
          </Link>

          <div className="professor-card profile-card">

            {report.photo && (
              <div className="lf-detail-photo">
                <img src={photoUrl(report.photo)} alt={report.item_name} />
              </div>
            )}

            <div className="lf-card-top">
              <span className={`lf-badge lf-badge-${report.type.toLowerCase()}`}>
                {report.type}
              </span>

              <span className={`lf-status lf-status-${report.status.toLowerCase()}`}>
                {report.status}
              </span>
            </div>

            <h2>{report.item_name}</h2>
            <p>{report.description}</p>

            <div className="professor-details">

              <div className="professor-detail">
                <span className="detail-icon">📍</span>
                <div>
                  <small>Location</small>
                  <strong>{report.location}</strong>
                </div>
              </div>

              <div className="professor-detail">
                <span className="detail-icon">📅</span>
                <div>
                  <small>Date</small>
                  <strong>{report.date}</strong>
                </div>
              </div>

              <div className="professor-detail">
                <span className="detail-icon">☎</span>
                <div>
                  <small>Reported by</small>
                  <strong>{report.reporter_name}</strong>
                  <a href={`tel:${report.contact_number}`}>{report.contact_number}</a>
                </div>
              </div>

            </div>

            <div className="profile-links">
              <a href={`tel:${report.contact_number}`} className="btn primary">
                Call {report.reporter_name.split(" ")[0]} →
              </a>

              <a href={`sms:${report.contact_number}`} className="btn secondary">
                Message →
              </a>
            </div>

            {report.status === "OPEN" && (
              <p className="lf-resolve-note">
                Marking a report as resolved will be available once reporter
                accounts are introduced, so only the original reporter can do it.
              </p>
            )}

          </div>

        </div>
      </section>

    </main>
  );
}

export default LostFoundDetail;
