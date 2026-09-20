// React Router stellt die clientseitige Navigation bereit.
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";

// React-Hooks für Benutzerzustand und Initialisierung.
import {
    useEffect,
    useState
} from "react";


// Authentifizierungsfunktionen.
import {
    getCurrentUser,
    logoutUser
} from "./services/authService.js";


// Route Guard:
// Kontrolliert, ob ein Benutzer Adminrechte besitzt.
import AdminRoute from "./components/AdminRoute.jsx";


// Globale Layout-Komponenten.
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";


// Öffentliche Seiten.
import HomePage from "./pages/HomePage.jsx";
import TrainingPage from "./pages/TrainingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";


// Administrationsseiten.
import AdminPage from "./pages/AdminPage.jsx";
import AdminScenarioPage from "./pages/AdminScenarioPage.jsx";
import AdminScenarioListPage from "./pages/AdminScenarioListPage.jsx";


function App() {
    // Enthält den aktuell angemeldeten Benutzer.
    // null bedeutet: kein Benutzer angemeldet.
    const [user, setUser] = useState(null);

    // Während die bestehende Session geprüft wird,
    // soll der Route Guard noch keine Entscheidung treffen.
    const [authLoading, setAuthLoading] =
        useState(true);


    // -------------------------------------------------------
    // Bestehende Session beim Start wiederherstellen
    // -------------------------------------------------------

    useEffect(() => {
        async function loadUser() {
            try {
                // Backend fragt anhand des Session-Cookies,
                // ob bereits ein Benutzer angemeldet ist.
                const currentUser =
                    await getCurrentUser();

                // Benutzer im globalen App-State speichern.
                setUser(currentUser);
            } finally {
                // Session-Prüfung ist abgeschlossen.
                setAuthLoading(false);
            }
        }

        loadUser();
    }, []);


    // -------------------------------------------------------
    // Anwendung
    // -------------------------------------------------------

    return (
        <BrowserRouter>

            <div className="app-layout">

                {/* Globale Navigation */}
                <Navbar
                    user={user}

                    onLogout={async () => {
                        // Session auf dem Backend beenden.
                        await logoutUser();

                        // Benutzer auch aus dem Frontend-State entfernen.
                        setUser(null);
                    }}
                />


                <div className="app-content">

                    {/* Hier werden alle URL-Routen der Anwendung definiert. */}
                    <Routes>

                        {/* ----------------------------- */}
                        {/* Öffentliche Seiten */}
                        {/* ----------------------------- */}

                        <Route
                            path="/"
                            element={<HomePage />}
                        />

                        <Route
                            path="/training"
                            element={<TrainingPage />}
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
                            element={<RegisterPage />}
                        />


                        {/* ----------------------------- */}
                        {/* Admin-Dashboard */}
                        {/* ----------------------------- */}

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


                        {/* ----------------------------- */}
                        {/* Liste aller Szenarien */}
                        {/* ----------------------------- */}

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


                        {/* ----------------------------- */}
                        {/* Neues Szenario erstellen */}
                        {/* ----------------------------- */}

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


                        {/* ----------------------------- */}
                        {/* Bestehendes Szenario bearbeiten */}
                        {/* :id wird später mit useParams() gelesen. */}
                        {/* ----------------------------- */}

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


                {/* Footer wird auf allen Seiten angezeigt. */}
                <Footer />

            </div>

        </BrowserRouter>
    );
}

export default App;