import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://192.168.49.2:30001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" required placeholder="Password" value={formData.password} onChange={handleChange} />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <button onClick={() => navigate("/signup")}>Sign Up</button>
      </p>
    </div>
  );
};

export default Login;


