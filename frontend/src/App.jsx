// React Router für clientseitige Navigation.
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";


// React-Hooks für Login-Zustand und Session-Wiederherstellung.
import {
    useEffect,
    useState
} from "react";


// Authentifizierungsfunktionen.
import {
    getCurrentUser,
    logoutUser
} from "./services/authService.js";


// Admin Route Guard.
import AdminRoute
    from "./components/AdminRoute.jsx";


// Globale Komponenten.
import Navbar
    from "./components/Navbar.jsx";

import Footer
    from "./components/Footer.jsx";


// Öffentliche Seiten.
import HomePage
    from "./pages/HomePage.jsx";

import TrainingPage
    from "./pages/TrainingPage.jsx";

import LoginPage
    from "./pages/LoginPage.jsx";

import RegisterPage
    from "./pages/RegisterPage.jsx";


// Informationsseiten.
import AboutPage
    from "./pages/AboutPage.jsx";

import ContactPage
    from "./pages/ContactPage.jsx";

import PrivacyPage
    from "./pages/PrivacyPage.jsx";

import ImprintPage
    from "./pages/ImprintPage.jsx";


// Statistik.
import StatisticsPage
    from "./pages/StatisticsPage.jsx";


// Administrationsseiten.
import AdminPage
    from "./pages/AdminPage.jsx";

import AdminScenarioPage
    from "./pages/AdminScenarioPage.jsx";

import AdminScenarioListPage
    from "./pages/AdminScenarioListPage.jsx";


function App() {

    // Aktuell eingeloggter Benutzer.
    const [user, setUser] =
        useState(null);


    // Zeigt an, ob die Session beim Start noch geprüft wird.
    const [
        authLoading,
        setAuthLoading
    ] = useState(true);


    // -------------------------------------------------------
    // Bestehende Session wiederherstellen
    // -------------------------------------------------------

    useEffect(() => {

        async function loadUser() {

            try {

                // Aktuellen Benutzer vom Backend laden.
                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

            } finally {

                // Session-Prüfung abgeschlossen.
                setAuthLoading(false);
            }
        }


        loadUser();

    }, []);


    return (
        <BrowserRouter>

            <div className="app-layout">

                {/* Globale Navigation */}
                <Navbar
                    user={user}

                    onLogout={async () => {

                        // Backend-Session beenden.
                        await logoutUser();

                        // Frontend-Zustand zurücksetzen.
                        setUser(null);
                    }}
                />


                <div className="app-content">

                    <Routes>

                        {/* =========================================== */}
                        {/* Öffentliche Seiten */}
                        {/* =========================================== */}

                        <Route
                            path="/"
                            element={
                                <HomePage />
                            }
                        />


                        {/* Training funktioniert auch ohne Anmeldung. */}
                        <Route
                            path="/training"
                            element={
                                <TrainingPage
                                    user={user}
                                />
                            }
                        />


                        <Route
                            path="/login"
                            element={
                                <LoginPage
                                    onLogin={setUser}
                                />
                            }
                        />


                        <Route
                            path="/register"
                            element={
                                <RegisterPage />
                            }
                        />


                        {/* =========================================== */}
                        {/* Projekt- und Informationsseiten */}
                        {/* =========================================== */}

                        <Route
                            path="/about"
                            element={
                                <AboutPage />
                            }
                        />


                        <Route
                            path="/contact"
                            element={
                                <ContactPage />
                            }
                        />


                        <Route
                            path="/privacy"
                            element={
                                <PrivacyPage />
                            }
                        />


                        <Route
                            path="/imprint"
                            element={
                                <ImprintPage />
                            }
                        />


                        {/* =========================================== */}
                        {/* Persönliche Statistik */}
                        {/* =========================================== */}

                        <Route
                            path="/statistics"
                            element={

                                // Während die Session geladen wird,
                                // zeigen wir noch keine Weiterleitung.
                                authLoading
                                    ? (
                                        <main className="page-container">
                                            <p>
                                                Benutzer wird geladen …
                                            </p>
                                        </main>
                                    )

                                    // Ohne Login geht es zur Login-Seite.
                                    : !user
                                        ? (
                                            <Navigate
                                                to="/login"
                                                replace
                                            />
                                        )

                                        // Eingeloggte Benutzer dürfen
                                        // ihre Statistik sehen.
                                        : (
                                            <StatisticsPage />
                                        )
                            }
                        />


                        {/* =========================================== */}
                        {/* Admin Dashboard */}
                        {/* =========================================== */}

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


                        {/* =========================================== */}
                        {/* Scenario-Verwaltung */}
                        {/* =========================================== */}

                        <Route
                            path="/admin/scenarios"
                            element={
                                <AdminRoute
                                    user={user}
                                    authLoading={authLoading}
                                >
                                    <AdminScenarioListPage />
                                </AdminRoute>
                            }
                        />


                        {/* Neues Szenario erstellen */}
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


                        {/* Bestehendes Szenario bearbeiten */}
                        <Route
                            path="/admin/scenarios/:id/edit"
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


                {/* Footer auf allen Seiten */}
                <Footer />

            </div>

        </BrowserRouter>
    );
}


export default App;