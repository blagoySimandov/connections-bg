import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider, ProtectedRoute } from "./auth";
import { RootLayout } from "./components/layout";
import { LoginPage, GamePage } from "./pages";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
