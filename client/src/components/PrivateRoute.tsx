import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
}

// ログインしている場合はchildrenを表示し、ログインしていない場合はログインページにリダイレクトする
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  const { user } = authContext;

  return user ? children : <Navigate to="/login" />;
};
