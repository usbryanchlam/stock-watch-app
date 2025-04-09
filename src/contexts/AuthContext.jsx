import { createContext, useCallback, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getCookie } from "../utils/authHelper";

const AuthContext = createContext();

const initialState = {
  id: sessionStorage.getItem("id") || null,
  name: sessionStorage.getItem("name") || null,
  email: sessionStorage.getItem("email") || null,
  picture: sessionStorage.getItem("picture") || null,
  error: "",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const END_POINT_USER = import.meta.env.VITE_END_POINT_USER;
const END_POINT_SIGNOUT = import.meta.env.VITE_END_POINT_SIGNOUT;

function reducer(state, action) {
  switch (action.type) {
    case "signedin":
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        picture: action.payload.picture,
        error: "",
      };
    case "signedout":
      return initialState;

    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

export const AuthProvider = ({ children }) => {
  const [{ id, name, email, picture, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const signin = useCallback((userObj) => {
    if (userObj) {
      sessionStorage.setItem("id", userObj.id);
      sessionStorage.setItem("name", userObj.name);
      sessionStorage.setItem("email", userObj.email);
      sessionStorage.setItem("picture", userObj.picture);

      dispatch({ type: "signedin", payload: userObj });
    }
  }, []);

  const signout = useCallback(async () => {
    try {
      const csrfToken = getCookie("XSRF-TOKEN");
      const response = await axios.post(
        API_BASE_URL + END_POINT_SIGNOUT,
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
        },
      );
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("picture");
      dispatch({ type: "signedout" });
      return response.data.success;
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error signing out...",
      });
    }
  }, []);

  const deleteUser = useCallback(async (id, email) => {
    try {
      const csrfToken = getCookie("XSRF-TOKEN");

      const response = await axios.delete(
        API_BASE_URL + END_POINT_USER + "/" + id,
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
          data: {
            email: email,
          },
        },
      );

      dispatch({ type: "signedout" });

      return response.data.success;
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting profile information...",
      });
    }
  }, []);

  const contextValue = useMemo(
    () => ({ id, name, email, picture, error, signin, signout, deleteUser }),
    [id, name, email, picture, error, signin, signout, deleteUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContext;
