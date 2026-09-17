import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import LostFound from "./pages/LostFound";
import Societies from "./pages/Societies";
import CampusMap from "./pages/CampusMap";
import Professors from "./pages/Professors";
import Calendar from "./pages/Calendar";
import CampusInfo from "./pages/CampusInfo";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lost-found" element={<LostFound />} />
        <Route path="/societies" element={<Societies />} />
        <Route path="/campus-map" element={<CampusMap />} />
        <Route path="/professors" element={<Professors />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/campus-info" element={<CampusInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;