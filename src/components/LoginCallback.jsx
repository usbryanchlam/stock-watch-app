import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const END_POINT_USER = "/users/me";

function LoginCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { signin } = useContext(AuthContext);

  useEffect(() => {
    const handleLoginCallback = async () => {
      try {
        // Extract token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        if (!token) {
          // If no token is found, redirect to login page
          setError("No authentication token found");
          navigate("/login");
          return;
        }
        const response = await axios.get(API_BASE_URL + END_POINT_USER, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = response.data.data;
        const userObj = { ...responseData, token: token };

        if (response.data.success) {
          signin(userObj);
          navigate("/app");
        } else setError("Cannot find authorized user information");
      } catch (err) {
        console.error("Login callback error:", err);
        setError("Authentication failed");
        navigate("/login");
      }
    };

    handleLoginCallback();
  }, [signin, navigate]);

  // Render a loading state or error message
  if (error) {
    return (
      <div className="login-callback">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>Return to Login</button>
      </div>
    );
  }

  // Render a loading spinner while processing
  return (
    <div>
      <div className="spinner">
        <p>Authenticating...</p>
      </div>
    </div>
  );
}

export default LoginCallback;
