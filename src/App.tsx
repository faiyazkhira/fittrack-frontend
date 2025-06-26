import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
