import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { id } = useContext(AuthContext);

  useEffect(() => {
    if (!id) {
      navigate("/login");
    }
  }, [id, navigate]);

  return children;
}

export default ProtectedRoute;
