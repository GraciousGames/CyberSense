import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminScenarioPage from "./pages/AdminScenarioPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import TrainingPage from "./pages/TrainingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/scenarios/new" element={<AdminScenarioPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;