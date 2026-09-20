// Zentrale Basis-URL für alle Requests an das CyberSense-Backend.
//
// Lokal wird standardmäßig der Express-Server auf Port 3000 verwendet.
// Auf dem HAW-Server kann die URL über VITE_API_BASE_URL gesetzt werden.
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:3000/api";

export default API_BASE_URL;