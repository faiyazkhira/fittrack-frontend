import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./components/Layout";
import { Toaster } from "sonner";
import LoginFormDemo from "./components/login-form";
import SignupFormDemo from "./components/ui/signup-form";
import ResetPasswordForm from "./components/reset-password-form";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
  return (
    <>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginFormDemo />} />
              <Route path="/register" element={<SignupFormDemo />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
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
      <Toaster />
    </>
  );
}

export default App;
