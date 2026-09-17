import { useState } from "react";
import campusMapImage from "../assets/campus-map.png";

function CampusMap() {
  const locations = [
    {
      name: "Admin Block",
      type: "Administration",
      description:
        "Main administrative offices and student services.",
    },
    {
      name: "Library",
      type: "Academic",
      description:
        "Central library with books, study spaces and academic resources.",
    },
    {
      name: "Student Centre",
      type: "Student Life",
      description:
        "A central space for student activities and gatherings.",
    },
    {
      name: "Academic Block",
      type: "Academic",
      description:
        "Classrooms, lecture halls and academic facilities.",
    },
    {
      name: "Sports Complex",
      type: "Sports",
      description:
        "Facilities for sports, fitness and recreational activities.",
    },
    {
      name: "Hostels",
      type: "Residential",
      description:
        "Residential facilities for students on campus.",
    },
  ];

  const [selectedLocation, setSelectedLocation] = useState(
    locations[0]
  );

  return (
    <main>
      {/* PAGE HEADER */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">CAMPUS NAVIGATION</span>

          <h1>Explore your campus.</h1>

          <p>
            Find important buildings, facilities and student spaces
            around campus.
          </p>
        </div>
      </section>

      {/* REAL CAMPUS MAP */}
      <section className="section campus-map-section">
        <div className="container">

          <div className="campus-map-wrapper">

            <div className="campus-map-header">
              <div>
                <span className="badge">CAMPUS MAP</span>

                <h2>Thapar Campus</h2>

                <p>
                  Explore the campus and find important locations.
                </p>
              </div>
            </div>

            <div className="real-campus-map">
              <img
                src={campusMapImage}
                alt="Thapar Institute campus map"
              />
            </div>

          </div>

        </div>
      </section>

      {/* CAMPUS LOCATIONS */}
      <section className="section">
        <div className="container">

          <div className="section-heading">

            <span className="badge">
              CAMPUS LOCATIONS
            </span>

            <h2>Important places</h2>

            <p>
              Select a location to view more information.
            </p>

          </div>

          <div className="location-grid">

            {locations.map((location) => (
              <button
                key={location.name}
                className={`location-card ${
                  selectedLocation.name === location.name
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedLocation(location)
                }
              >

                <span className="location-card-icon">
                  +
                </span>

                <span>
                  <strong>{location.name}</strong>

                  <small>
                    {location.type}
                  </small>
                </span>

              </button>
            ))}

          </div>

          {/* SELECTED LOCATION */}
          <div className="location-panel campus-location-panel">

            <span className="society-category">
              SELECTED LOCATION
            </span>

            <h2>
              {selectedLocation.name}
            </h2>

            <p className="location-type">
              {selectedLocation.type}
            </p>

            <p>
              {selectedLocation.description}
            </p>

            <button className="btn primary">
              Get Directions
            </button>

          </div>

        </div>
      </section>

    </main>
  );
}

export default CampusMap;