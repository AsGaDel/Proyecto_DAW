import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ARITLogin } from "../components/AuthCard";

export default function Login() {
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const handleLogin = async (data, done) => {
    try {
      await login({ email: data.username, password: data.password });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail ?? "Usuario o contraseña incorrectos.";
      alert(msg); // sustituye por toast cuando lo tengas conectado
    } finally {
      done();
    }
  };

  return <ARITLogin onSubmit={handleLogin} />;
}