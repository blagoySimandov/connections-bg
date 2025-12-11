import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider, ProtectedRoute, AdminRoute } from "./auth";
import { RootLayout } from "./components/layout";
import { LoginPage, GamePage } from "./pages";
import { AdminPage } from "./pages/admin";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<GamePage />} />
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
    </AuthProvider>
  );
}

export default App;
