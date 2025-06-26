import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const token = useAuthStore((state) => state.token);

  if (!token) return <Navigate to="/Login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
