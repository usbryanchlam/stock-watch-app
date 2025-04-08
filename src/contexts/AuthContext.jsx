import { createContext, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";

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

  function signin(userObj) {
    if (userObj) {
      sessionStorage.setItem("id", userObj.id);
      sessionStorage.setItem("name", userObj.name);
      sessionStorage.setItem("email", userObj.email);
      sessionStorage.setItem("picture", userObj.picture);

      dispatch({ type: "signedin", payload: userObj });
    }
  }

  async function signout() {
    try {
      const response = await axios.post(
        API_BASE_URL + END_POINT_SIGNOUT,
        {},
        {
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
  }

  async function deleteUser(id, email) {
    try {
      const response = await axios.delete(
        API_BASE_URL + END_POINT_USER + "/" + id,
        {
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
  }

  return (
    <AuthContext.Provider
      value={{
        id,
        name,
        email,
        picture,
        error,
        signin,
        signout,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContext;
