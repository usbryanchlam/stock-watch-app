import { createContext, useCallback, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
  token: null,
  id: null,
  name: null,
  email: null,
  picture: null,
  error: "",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const END_POINT_USER = "/users/me";

function reducer(state, action) {
  switch (action.type) {
    case "signedin":
      return {
        ...state,
        token: action.payload.token,
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
  const [{ token, id, name, email, picture, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const signin = useCallback((userObj) => {
    if (userObj) {
      dispatch({ type: "signedin", payload: userObj });
    }
  }, []);

  const signout = useCallback(async () => {
    try {
      dispatch({ type: "signedout" });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error signing out...",
      });
    }
  }, []);

  const deleteUser = useCallback(
    async (id, email) => {
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
    },
    [token],
  );

  const contextValue = useMemo(
    () => ({
      token,
      id,
      name,
      email,
      picture,
      error,
      signin,
      signout,
      deleteUser,
    }),
    [token, id, name, email, picture, error, signin, signout, deleteUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContext;
