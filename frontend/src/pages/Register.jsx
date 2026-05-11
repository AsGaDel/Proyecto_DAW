import { ARITRegister } from "../components/AuthCard";

export default function Register() {
  return <ARITRegister />;
}

/* import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { ARITRegister } from "../components/AuthCard";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (data, done) => {
    try {
      await authService.register({
        fullName:  data.fullName,
        username:  data.username,
        email:     data.email,
        password:  data.password,
      });
      navigate("/login");
    } catch (err) {
      const errors = err.response?.data;
      let msg = "Error al registrarse.";
      if (errors) {
        // Django devuelve los errores por campo: { username: ["Ya existe"], email: [...] }
        const firstError = Object.values(errors)[0];
        if (Array.isArray(firstError)) msg = firstError[0];
      }
      alert(msg); // sustituye por toast cuando lo tengas conectado
    } finally {
      done();
    }
  };

  return <ARITRegister onSubmit={handleRegister} />;
} */