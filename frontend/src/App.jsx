import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  logoutUser
} from "./services/authService.js";
import AdminRoute from "./components/AdminRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminScenarioPage from "./pages/AdminScenarioPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import TrainingPage from "./pages/TrainingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, []);
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar
            user={user}
            onLogout={async () => {
              await logoutUser();
              setUser(null);
            }}
        />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/login" element={<LoginPage onLogin={setUser} />}/>
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/admin"
                element={
                  <AdminRoute
                      user={user}
                      authLoading={authLoading}
                  >
                    <AdminPage />
                  </AdminRoute>
                }
            />

            <Route
                path="/admin/scenarios/new"
                element={
                  <AdminRoute
                      user={user}
                      authLoading={authLoading}
                  >
                    <AdminScenarioPage />
                  </AdminRoute>
                }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;