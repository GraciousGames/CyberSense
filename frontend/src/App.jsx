import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import TrainingPage from "./pages/TrainingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;