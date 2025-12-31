import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Weapons from "./pages/Weapons";
import WeaponDetail from "./pages/WeaponDetail";
import Warframes from "./pages/Warframes";
import WarframeDetail from "./pages/WarframeDetail";
import Terms from "./pages/Terms";
import "./App.css";

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/weapons" replace />} />
          <Route path="/weapons" element={<Weapons />} />
          <Route path="/weapon/:slug" element={<WeaponDetail />} />
          <Route path="/warframes" element={<Warframes />} />
          <Route path="/warframe/:slug" element={<WarframeDetail />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
