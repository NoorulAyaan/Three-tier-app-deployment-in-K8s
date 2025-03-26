import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://192.168.49.2:30001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        navigate("/");
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input type="text" name="name" required placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" required placeholder="Password" value={formData.password} onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <button onClick={() => navigate("/")}>Sign In</button>
      </p>
    </div>
  );
};

export default SignUp;


