import { useState } from "react";
import academicCalendar from "../assets/academic-calendar.jpg";

function Calendar() {
  const [view, setView] = useState("calendar");

  return (
    <main>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">ACADEMIC CALENDAR</span>

          <h1>Stay on schedule.</h1>

          <p>
            View the official academic calendar and keep track of
            important academic dates and events.
          </p>
        </div>
      </section>

      {/* CALENDAR */}
      <section className="section academic-calendar-section">
        <div className="container">

          <div className="calendar-page-header">
            <div>
              <span className="badge">ACADEMIC YEAR</span>

              <h2>Academic Calendar</h2>

              <p>
                Official academic schedule for students and faculty.
              </p>
            </div>

            <div className="calendar-actions">
              <button
                className={`calendar-view-btn ${
                  view === "calendar" ? "active" : ""
                }`}
                onClick={() => setView("calendar")}
              >
                Calendar
              </button>

              <button
                className={`calendar-view-btn ${
                  view === "full" ? "active" : ""
                }`}
                onClick={() => setView("full")}
              >
                Full View
              </button>
            </div>
          </div>

          {/* CALENDAR IMAGE */}
          <div
            className={`academic-calendar-card ${
              view === "full" ? "full-view" : ""
            }`}
          >
            <img
              src={academicCalendar}
              alt="Official academic calendar"
            />
          </div>

          {/* INFORMATION */}
          <div className="calendar-info">

            <div className="calendar-info-card">
              <div className="calendar-info-icon">
                📅
              </div>

              <div>
                <h3>Academic Schedule</h3>

                <p>
                  Check the calendar regularly for classes,
                  examinations, holidays and other important
                  academic dates.
                </p>
              </div>
            </div>

            <div className="calendar-info-card">
              <div className="calendar-info-icon">
                ℹ
              </div>

              <div>
                <h3>Important Dates</h3>

                <p>
                  Keep track of registration deadlines,
                  examinations, breaks and semester activities.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}

export default Calendar;