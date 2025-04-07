import { createContext, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
  id: null,
  name: null,
  email: null,
  token: sessionStorage.getItem("token") || null,
  picture: null,
  watchedStocks: [],
  error: "",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const END_POINT_USER = import.meta.env.VITE_END_POINT_USER;

function reducer(state, action) {
  switch (action.type) {
    case "signedin":
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        token: action.payload.token,
        picture: action.payload.picture,
        watchedStocks: action.payload.watchedStocks,
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
  const [{ id, name, email, token, picture, watchedStocks, error }, dispatch] =
    useReducer(reducer, initialState);

  function signin(userObj) {
    if (userObj) {
      sessionStorage.setItem("token", userObj.token);
      dispatch({ type: "signedin", payload: userObj });
    }
  }

  function signout() {
    sessionStorage.removeItem("token");
    dispatch({ type: "signedout" });
  }

  async function deleteUser(token, id, email) {
    try {
      const response = await axios.delete(
        API_BASE_URL + END_POINT_USER + "/" + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        token,
        picture,
        watchedStocks,
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
