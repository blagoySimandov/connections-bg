import "./index.css";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router";

const Router = process.env.BUN_PUBLIC_PLATFORM === "fb" ? MemoryRouter : BrowserRouter;
import { AuthProvider, AnalyticsProvider, ProtectedRoute, AdminRoute } from "@/shared";
import { RootLayout } from "@/layout";
import { LoginPage, GamePage, AdminPage, ProfilePage, TermsPage, PrivacyPage, DataDeletionPage } from "./pages";

export function App() {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <Router>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<GamePage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/data-deletion" element={<DataDeletionPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default App;
