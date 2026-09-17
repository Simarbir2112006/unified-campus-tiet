import { useState } from "react";

function Societies() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const societies = [
    {
      name: "Computer Society",
      category: "Technical",
      description:
        "Explore coding, software development, AI, web development and technology.",
      icon: "⌘",
    },
    {
      name: "Robotics Club",
      category: "Technical",
      description:
        "Build robots, work with electronics and explore automation and robotics.",
      icon: "⚙",
    },
    {
      name: "Literary Society",
      category: "Cultural",
      description:
        "A community for writing, poetry, debates, storytelling and literature.",
      icon: "✎",
    },
    {
      name: "Dramatics Society",
      category: "Cultural",
      description:
        "Discover acting, theatre, stage performances and creative storytelling.",
      icon: "◈",
    },
    {
      name: "Music Society",
      category: "Cultural",
      description:
        "Connect with fellow musicians, singers and performers on campus.",
      icon: "♫",
    },
    {
      name: "Sports Club",
      category: "Sports",
      description:
        "Participate in sports activities, competitions and fitness events.",
      icon: "★",
    },
  ];

  const categories = ["All", "Technical", "Cultural", "Sports"];

  const filteredSocieties = societies.filter((society) => {
    const matchesCategory =
      category === "All" || society.category === category;

    const matchesSearch =
      society.name.toLowerCase().includes(search.toLowerCase()) ||
      society.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">CAMPUS COMMUNITIES</span>

          <h1>Find your community.</h1>

          <p>
            Explore technical, cultural, academic and sports societies around
            campus.
          </p>
        </div>
      </section>

      {/* SOCIETIES */}
      <section className="section">
        <div className="container">

          {/* SEARCH + FILTER */}
          <div className="society-controls">
            <div className="society-search">
              <input
                type="text"
                placeholder="Search societies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="society-filters">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`filter-btn ${
                    category === item ? "active" : ""
                  }`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* RESULTS */}
          {filteredSocieties.length > 0 ? (
            <div className="society-grid">
              {filteredSocieties.map((society) => (
                <article className="society-card" key={society.name}>

                  <div className="society-icon">
                    {society.icon}
                  </div>

                  <div className="society-content">
                    <span className="society-category">
                      {society.category}
                    </span>

                    <h2>{society.name}</h2>

                    <p>{society.description}</p>

                    <button className="society-link">
                      Explore Society →
                    </button>
                  </div>

                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No societies found</h2>
              <p>
                Try searching for something else or choose another category.
              </p>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}

export default Societies;