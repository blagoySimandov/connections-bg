import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider, AnalyticsProvider, ProtectedRoute, AdminRoute } from "@/shared";
import { RootLayout } from "@/layout";
import { LoginPage, GamePage, AdminPage, ProfilePage } from "./pages";

export function App() {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<GamePage />} />
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
        </BrowserRouter>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default App;
