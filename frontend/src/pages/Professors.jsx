import { useState } from "react";

function Professors() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const professors = [
    {
      name: "Dr. Rajesh Kumar",
      department: "Computer Science",
      designation: "Professor",
      cabin: "C-Block, Cabin 204",
      email: "rajesh.kumar@thapar.edu",
      subjects: "Data Structures, Algorithms",
      initials: "RK",
    },
    {
      name: "Dr. Anjali Sharma",
      department: "Computer Science",
      designation: "Associate Professor",
      cabin: "C-Block, Cabin 208",
      email: "anjali.sharma@thapar.edu",
      subjects: "Database Systems, Web Development",
      initials: "AS",
    },
    {
      name: "Dr. Amit Verma",
      department: "Electronics",
      designation: "Professor",
      cabin: "E-Block, Cabin 112",
      email: "amit.verma@thapar.edu",
      subjects: "Digital Electronics, Embedded Systems",
      initials: "AV",
    },
    {
      name: "Dr. Neha Gupta",
      department: "Mechanical",
      designation: "Assistant Professor",
      cabin: "M-Block, Cabin 305",
      email: "neha.gupta@thapar.edu",
      subjects: "Thermodynamics, Fluid Mechanics",
      initials: "NG",
    },
    {
      name: "Dr. Vikram Singh",
      department: "Electrical",
      designation: "Associate Professor",
      cabin: "E-Block, Cabin 216",
      email: "vikram.singh@thapar.edu",
      subjects: "Power Systems, Electrical Machines",
      initials: "VS",
    },
    {
      name: "Dr. Priya Mehta",
      department: "Civil",
      designation: "Assistant Professor",
      cabin: "B-Block, Cabin 118",
      email: "priya.mehta@thapar.edu",
      subjects: "Structural Engineering, Construction",
      initials: "PM",
    },
  ];

  const departments = [
    "All",
    "Computer Science",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
  ];

  const filteredProfessors = professors.filter((professor) => {
    const matchesDepartment =
      department === "All" ||
      professor.department === department;

    const searchText = search.toLowerCase();

    const matchesSearch =
      professor.name.toLowerCase().includes(searchText) ||
      professor.department.toLowerCase().includes(searchText) ||
      professor.subjects.toLowerCase().includes(searchText);

    return matchesDepartment && matchesSearch;
  });

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
          <div className="professor-results">
            <span>
              {filteredProfessors.length} professor
              {filteredProfessors.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* PROFESSOR CARDS */}
          {filteredProfessors.length > 0 ? (

            <div className="professor-grid">

              {filteredProfessors.map((professor) => (

                <article
                  className="professor-card"
                  key={professor.email}
                >

                  <div className="professor-top">

                    <div className="professor-avatar">
                      {professor.initials}
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
                        <a
                          href={`mailto:${professor.email}`}
                        >
                          {professor.email}
                        </a>
                      </div>
                    </div>

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

                  </div>

                  <button className="professor-direction-btn">
                    View Cabin Location →
                  </button>

                </article>

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