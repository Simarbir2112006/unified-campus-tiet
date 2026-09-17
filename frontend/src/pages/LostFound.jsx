import { useState } from "react";

function LostFound() {
  const [lostImage, setLostImage] = useState(null);
  const [foundImage, setFoundImage] = useState(null);

  const [lostSubmitted, setLostSubmitted] = useState(false);
  const [foundSubmitted, setFoundSubmitted] = useState(false);

  const handleLostImage = (event) => {
    const file = event.target.files[0];

    if (file) {
      setLostImage(URL.createObjectURL(file));
    }
  };

  const handleFoundImage = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFoundImage(URL.createObjectURL(file));
    }
  };

  const handleLostSubmit = (event) => {
    event.preventDefault();
    setLostSubmitted(true);

    setTimeout(() => {
      setLostSubmitted(false);
    }, 4000);
  };

  const handleFoundSubmit = (event) => {
    event.preventDefault();
    setFoundSubmitted(true);

    setTimeout(() => {
      setFoundSubmitted(false);
    }, 4000);
  };

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

            {/* LOST ITEM */}
            <div className="form-card">

              <div className="form-heading">
                <span className="form-icon">⌕</span>

                <div>
                  <h2>Report a Lost Item</h2>
                  <p>
                    Tell us about something you've lost on campus.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLostSubmit}>

                <div className="form-row">

                  <div className="form-group">
                    <label htmlFor="lost-name">
                      Your Name
                    </label>

                    <input
                      id="lost-name"
                      type="text"
                      placeholder="Enter your name"
                      required
                    />
                  </div>


                  <div className="form-group">
                    <label htmlFor="lost-roll">
                      Roll Number
                    </label>

                    <input
                      id="lost-roll"
                      type="text"
                      placeholder="Enter your roll number"
                      required
                    />
                  </div>

                </div>


                <div className="form-group">
                  <label htmlFor="lost-contact">
                    Contact Number
                  </label>

                  <input
                    id="lost-contact"
                    type="tel"
                    placeholder="Enter your contact number"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit contact number"
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="lost-item">
                    Lost Item
                  </label>

                  <input
                    id="lost-item"
                    type="text"
                    placeholder="e.g. Black Wallet, AirPods, ID Card"
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="lost-location">
                    Where was it lost?
                  </label>

                  <input
                    id="lost-location"
                    type="text"
                    placeholder="e.g. Library, C Block, Student Centre"
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="lost-description">
                    Description
                  </label>

                  <textarea
                    id="lost-description"
                    rows="4"
                    placeholder="Describe the item and any identifying details..."
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="lost-photo">
                    Upload a Photo
                  </label>

                  <input
                    id="lost-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleLostImage}
                  />

                  {lostImage && (
                    <div className="image-preview">
                      <img
                        src={lostImage}
                        alt="Lost item preview"
                      />
                    </div>
                  )}
                </div>


                <button
                  type="submit"
                  className="btn primary form-submit"
                >
                  Report Lost Item
                </button>


                {lostSubmitted && (
                  <div className="success-message">
                    ✓ Lost item report submitted successfully!
                  </div>
                )}

              </form>

            </div>


            {/* FOUND ITEM */}
            <div className="form-card">

              <div className="form-heading">
                <span className="form-icon">✦</span>

                <div>
                  <h2>Report a Found Item</h2>
                  <p>
                    Help someone find what they have lost.
                  </p>
                </div>
              </div>


              <form onSubmit={handleFoundSubmit}>

                <div className="form-row">

                  <div className="form-group">
                    <label htmlFor="found-name">
                      Your Name
                    </label>

                    <input
                      id="found-name"
                      type="text"
                      placeholder="Enter your name"
                      required
                    />
                  </div>


                  <div className="form-group">
                    <label htmlFor="found-roll">
                      Roll Number
                    </label>

                    <input
                      id="found-roll"
                      type="text"
                      placeholder="Enter your roll number"
                      required
                    />
                  </div>

                </div>


                <div className="form-group">
                  <label htmlFor="found-contact">
                    Contact Number
                  </label>

                  <input
                    id="found-contact"
                    type="tel"
                    placeholder="Enter your contact number"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit contact number"
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="found-item">
                    Found Item
                  </label>

                  <input
                    id="found-item"
                    type="text"
                    placeholder="e.g. Black Wallet, AirPods, ID Card"
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="found-location">
                    Where was it found?
                  </label>

                  <input
                    id="found-location"
                    type="text"
                    placeholder="e.g. Library, C Block, Student Centre"
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="found-description">
                    Description
                  </label>

                  <textarea
                    id="found-description"
                    rows="4"
                    placeholder="Describe the item and where you found it..."
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="found-photo">
                    Upload a Photo
                  </label>

                  <input
                    id="found-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFoundImage}
                  />

                  {foundImage && (
                    <div className="image-preview">
                      <img
                        src={foundImage}
                        alt="Found item preview"
                      />
                    </div>
                  )}
                </div>


                <button
                  type="submit"
                  className="btn primary form-submit"
                >
                  Report Found Item
                </button>


                {foundSubmitted && (
                  <div className="success-message">
                    ✓ Found item report submitted successfully!
                  </div>
                )}

              </form>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default LostFound;