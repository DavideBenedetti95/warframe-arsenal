import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Weapons from "./pages/Weapons";
import WeaponDetail from "./pages/WeaponDetail";
import Warframes from "./pages/Warframes";
import WarframeDetail from "./pages/WarframeDetail";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Relics from "./pages/Relics";
import "./App.css";

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weapons" element={<Weapons />} />
          <Route path="/weapon/:slug" element={<WeaponDetail />} />
          <Route path="/warframes" element={<Warframes />} />
          <Route path="/warframe/:slug" element={<WarframeDetail />} />
          <Route path="/relics" element={<Relics />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
