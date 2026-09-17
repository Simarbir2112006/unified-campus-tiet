import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createReport, fetchReports, photoUrl } from "../api/lostFound";

function today() {
  return new Date().toISOString().split("T")[0];
}

function emptyFormState() {
  return {
    name: "",
    roll: "",
    contact: "",
    item: "",
    location: "",
    date: today(),
    description: "",
  };
}

function ReportForm({
  reportType,
  icon,
  title,
  subtitle,
  itemLabel,
  itemPlaceholder,
  locationLabel,
  locationPlaceholder,
  descriptionPlaceholder,
  submitLabel,
  onSubmitted,
}) {
  const [form, setForm] = useState(emptyFormState());
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const idPrefix = reportType.toLowerCase();

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("type", reportType);
    formData.append("item_name", form.item);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("date", form.date);
    formData.append("reporter_name", form.name);
    formData.append("roll_number", form.roll);
    formData.append("contact_number", form.contact);
    if (photoFile) formData.append("photo", photoFile);

    try {
      await createReport(formData);
      setSubmitted(true);
      setForm(emptyFormState());
      setPhotoFile(null);
      setPhotoPreview(null);
      onSubmitted();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err.message || "Could not submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">

      <div className="form-heading">
        <span className="form-icon">{icon}</span>

        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="form-row">

          <div className="form-group">
            <label htmlFor={`${idPrefix}-name`}>Your Name</label>
            <input
              id={`${idPrefix}-name`}
              type="text"
              placeholder="Enter your name"
              required
              value={form.name}
              onChange={updateField("name")}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${idPrefix}-roll`}>Roll Number</label>
            <input
              id={`${idPrefix}-roll`}
              type="text"
              placeholder="Enter your roll number"
              required
              value={form.roll}
              onChange={updateField("roll")}
            />
          </div>

        </div>

        <div className="form-group">
          <label htmlFor={`${idPrefix}-contact`}>Contact Number</label>
          <input
            id={`${idPrefix}-contact`}
            type="tel"
            placeholder="Enter your contact number"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit contact number"
            required
            value={form.contact}
            onChange={updateField("contact")}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${idPrefix}-item`}>{itemLabel}</label>
          <input
            id={`${idPrefix}-item`}
            type="text"
            placeholder={itemPlaceholder}
            required
            value={form.item}
            onChange={updateField("item")}
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label htmlFor={`${idPrefix}-location`}>{locationLabel}</label>
            <input
              id={`${idPrefix}-location`}
              type="text"
              placeholder={locationPlaceholder}
              required
              value={form.location}
              onChange={updateField("location")}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${idPrefix}-date`}>Date</label>
            <input
              id={`${idPrefix}-date`}
              type="date"
              required
              max={today()}
              value={form.date}
              onChange={updateField("date")}
            />
          </div>

        </div>

        <div className="form-group">
          <label htmlFor={`${idPrefix}-description`}>Description</label>
          <textarea
            id={`${idPrefix}-description`}
            rows="4"
            placeholder={descriptionPlaceholder}
            required
            value={form.description}
            onChange={updateField("description")}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${idPrefix}-photo`}>Upload a Photo</label>

          <input
            id={`${idPrefix}-photo`}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />

          {photoPreview && (
            <div className="image-preview">
              <img src={photoPreview} alt={`${itemLabel} preview`} />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn primary form-submit"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : submitLabel}
        </button>

        {submitted && (
          <div className="success-message">
            ✓ {title} submitted successfully!
          </div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

      </form>

    </div>
  );
}

function LostFound() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);

      fetchReports({ type: typeFilter, search })
        .then(setReports)
        .catch((err) => setError(err.message || "Could not load reports."))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, typeFilter, refreshKey]);

  return (
    <main>

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">

          <span className="badge">
            CAMPUS LOST & FOUND
          </span>

          <h1>
            Lost something? Found something?
          </h1>

          <p>
            Report lost and found items and help reunite them with their owners.
          </p>

        </div>
      </section>


      {/* FORMS */}
      <section className="section">
        <div className="container">

          <div className="lost-found-grid">

            <ReportForm
              reportType="LOST"
              icon="⌕"
              title="Report a Lost Item"
              subtitle="Tell us about something you've lost on campus."
              itemLabel="Lost Item"
              itemPlaceholder="e.g. Black Wallet, AirPods, ID Card"
              locationLabel="Where was it lost?"
              locationPlaceholder="e.g. Library, C Block, Student Centre"
              descriptionPlaceholder="Describe the item and any identifying details..."
              submitLabel="Report Lost Item"
              onSubmitted={reload}
            />

            <ReportForm
              reportType="FOUND"
              icon="✦"
              title="Report a Found Item"
              subtitle="Help someone find what they have lost."
              itemLabel="Found Item"
              itemPlaceholder="e.g. Black Wallet, AirPods, ID Card"
              locationLabel="Where was it found?"
              locationPlaceholder="e.g. Library, C Block, Student Centre"
              descriptionPlaceholder="Describe the item and where you found it..."
              submitLabel="Report Found Item"
              onSubmitted={reload}
            />

          </div>

        </div>
      </section>


      {/* INVENTORY */}
      <section className="section">
        <div className="container">

          <div className="section-heading">
            <span className="badge">CAMPUS BOARD</span>
            <h2>Browse reports</h2>
            <p>Search existing lost and found reports from across campus.</p>
          </div>

          <div className="lf-controls">

            <div className="lf-search">
              <input
                type="text"
                placeholder="Search item, description or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="lf-filters">
              {["All", "Lost", "Found"].map((item) => (
                <button
                  key={item}
                  className={`filter-btn ${typeFilter === item ? "active" : ""}`}
                  onClick={() => setTypeFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              <h2>Loading reports…</h2>
            </div>

          ) : error ? (

            <div className="empty-state">
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>

          ) : reports.length > 0 ? (

            <div className="lf-grid">

              {reports.map((report) => (
                <Link
                  to={`/lost-found/${report.id}`}
                  className="lf-card"
                  key={report.id}
                >

                  {report.photo && (
                    <div className="lf-card-photo">
                      <img src={photoUrl(report.photo)} alt={report.item_name} />
                    </div>
                  )}

                  <div className="lf-card-body">

                    <div className="lf-card-top">
                      <span className={`lf-badge lf-badge-${report.type.toLowerCase()}`}>
                        {report.type}
                      </span>

                      <span className={`lf-status lf-status-${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </div>

                    <h3>{report.item_name}</h3>
                    <p>{report.description}</p>

                    <div className="lf-card-meta">
                      <span>📍 {report.location}</span>
                      <span>📅 {report.date}</span>
                    </div>

                  </div>

                </Link>
              ))}

            </div>

          ) : (

            <div className="empty-state">
              <h2>No reports found</h2>
              <p>Try a different search or filter, or be the first to report something.</p>
            </div>

          )}

        </div>
      </section>

    </main>
  );
}

export default LostFound;
