function CampusInfo() {
  const facilities = [
    {
      icon: "▣",
      title: "Central Library",
      description:
        "Access books, journals, digital resources and dedicated study spaces for academic work.",
      tag: "Academic",
    },
    {
      icon: "⌂",
      title: "Hostels",
      description:
        "Residential facilities with essential amenities and comfortable spaces for students.",
      tag: "Residential",
    },
    {
      icon: "★",
      title: "Sports Complex",
      description:
        "Take part in sports, fitness activities and recreational programs across campus.",
      tag: "Sports",
    },
    {
      icon: "◈",
      title: "Student Centre",
      description:
        "A central hub for student activities, societies, events and everyday campus life.",
      tag: "Student Life",
    },
    {
      icon: "⚙",
      title: "Academic Blocks",
      description:
        "Lecture halls, classrooms, laboratories and other facilities for teaching and learning.",
      tag: "Academic",
    },
    {
      icon: "✦",
      title: "Campus Services",
      description:
        "Find administrative support, student services and other essential campus facilities.",
      tag: "Services",
    },
  ];

  const quickInfo = [
    {
      title: "Campus",
      value: "Thapar Institute of Engineering & Technology",
    },
    {
      title: "Location",
      value: "Patiala, Punjab, India",
    },
    {
      title: "Campus Type",
      value: "Residential University Campus",
    },
    {
      title: "Student Life",
      value: "Societies, sports, events & activities",
    },
  ];

  return (
    <main>

      {/* HERO */}
      <section className="page-hero">
        <div className="container">

          <span className="badge">
            CAMPUS INFORMATION
          </span>

          <h1>
            Everything about your campus.
          </h1>

          <p>
            Discover facilities, student spaces and essential
            information to make the most of campus life.
          </p>

        </div>
      </section>


      {/* QUICK INFORMATION */}
      <section className="section campus-info-section">
        <div className="container">

          <div className="section-heading">
            <span className="badge">
              AT A GLANCE
            </span>

            <h2>
              Campus overview
            </h2>

            <p>
              A quick look at the university and the facilities
              available to students.
            </p>
          </div>


          <div className="campus-overview-grid">

            {quickInfo.map((item) => (
              <div
                className="campus-overview-card"
                key={item.title}
              >

                <span className="campus-overview-label">
                  {item.title}
                </span>

                <strong>
                  {item.value}
                </strong>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* FACILITIES */}
      <section className="section campus-facilities-section">
        <div className="container">

          <div className="section-heading">
            <span className="badge">
              CAMPUS FACILITIES
            </span>

            <h2>
              Everything you need
            </h2>

            <p>
              Explore some of the important facilities available
              around campus.
            </p>
          </div>


          <div className="facility-grid">

            {facilities.map((facility) => (
              <article
                className="facility-card"
                key={facility.title}
              >

                <div className="facility-icon">
                  {facility.icon}
                </div>

                <span className="facility-tag">
                  {facility.tag}
                </span>

                <h3>
                  {facility.title}
                </h3>

                <p>
                  {facility.description}
                </p>

                <button className="facility-link">
                  Explore →
                </button>

              </article>
            ))}

          </div>

        </div>
      </section>


      {/* CAMPUS LIFE */}
      <section className="section campus-life-section">
        <div className="container">

          <div className="campus-life-card">

            <div className="campus-life-content">

              <span className="badge">
                CAMPUS LIFE
              </span>

              <h2>
                More than just academics.
              </h2>

              <p>
                From technical societies and cultural activities
                to sports, events and student communities, campus
                life offers plenty of opportunities to learn,
                connect and grow.
              </p>

              <div className="campus-life-actions">

                <a
                  href="/societies"
                  className="btn primary"
                >
                  Explore Societies
                </a>

                <a
                  href="/campus-map"
                  className="btn secondary"
                >
                  View Campus Map
                </a>

              </div>

            </div>

            <div className="campus-life-stats">

              <div>
                <strong>01</strong>
                <span>Academic Resources</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Student Communities</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Sports & Recreation</span>
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default CampusInfo;