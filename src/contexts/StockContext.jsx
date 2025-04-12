import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import AuthContext from "./AuthContext";

const StockContext = createContext();

const initialState = {
  watchedStocks: [],
  lastRefreshDatetime: null,
  isLoading: false,
  queryString: "",
  searchResult: [],
  currentStock: {},
  stockAlert: null,
  error: "",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const END_POINT_WATCHLIST = "/users/me/watch-list";
const END_POINT_SEARCH_STOCK = "/stocks";
const END_POINT_SET_ALERT = "/stock-alerts";

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "watchedStocks/loaded":
      return {
        ...state,
        isLoading: false,
        watchedStocks: action.payload,
        error: "",
      };
    case "searched":
      return {
        ...state,
        isLoading: false,
        searchResult: action.payload,
        error: "",
      };
    case "setting/queryText":
      return { ...state, queryString: action.payload, error: "" };
    case "viewing/stock":
      return { ...state, currentStock: action.payload, error: "" };
    case "setting/alert":
      return { ...state, stockAlert: action.payload, error: "" };
    case "removedStock":
      return {
        ...state,
        watchedStocks: action.payload,
        error: "",
      };
    case "refreshing":
      return { ...state, lastRefreshDatetime: action.payload, error: "" };
    case "rejected":
      return { ...state, error: action.payload };
    case "clearing":
      return action.payload;
    default:
      throw new Error("Unknown action");
  }
}

export const StockProvider = ({ children }) => {
  const [
    {
      watchedStocks,
      lastRefreshDatetime,
      isLoading,
      queryString,
      searchResult,
      currentStock,
      stockAlert,
      error,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { token } = useContext(AuthContext);

  const loadWatchedStock = useCallback(async () => {
    if (!token) return;
    dispatch({ type: "loading" });
    try {
      const response = await axios.get(API_BASE_URL + END_POINT_WATCHLIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = response.data.data;
      dispatch({ type: "watchedStocks/loaded", payload: responseData });
      const localeString = new Date(response.data.timestamp).toLocaleString();
      dispatch({ type: "refreshing", payload: localeString });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading watched stocks...",
      });
    }
  }, [token]);

  const searchStock = useCallback(
    async (queryText) => {
      if (!queryText && queryText.length < 3) return;
      dispatch({ type: "loading" });
      try {
        const response = await axios.get(
          API_BASE_URL + END_POINT_SEARCH_STOCK,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              query: `${queryText}`,
            },
          },
        );

        const responseData = response.data.data;
        dispatch({ type: "searched", payload: responseData });
        dispatch({ type: "setting/queryText", payload: queryText });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading search stock result...",
        });
      }
    },
    [token],
  );

  const addToWatchList = useCallback(
    async (symbol) => {
      try {
        const response = await axios.post(
          API_BASE_URL + END_POINT_WATCHLIST,
          { symbol: symbol },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        return response.data.success;
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error adding stock to the watch list...",
        });
      }
    },
    [token],
  );

  const removeFromWatchList = useCallback(
    async (symbol) => {
      try {
        const response = await axios.delete(
          API_BASE_URL + END_POINT_WATCHLIST + "/" + symbol,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        dispatch({
          type: "removedStock",
          payload: watchedStocks.filter((stock) => stock.symbol !== symbol),
        });

        return response.data.success;
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error removing stock from the watch list...",
        });
      }
    },
    [token],
  );

  const getStockAlert = useCallback(
    async (stock) => {
      try {
        const response = await axios.get(
          API_BASE_URL + END_POINT_SET_ALERT + "/" + stock.symbol,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const responseData = response.data.data;
        dispatch({ type: "viewing/stock", payload: stock });
        dispatch({ type: "setting/alert", payload: responseData });
        return response.data.success;
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error getting existing alert of the stock...",
        });
      }
    },
    [token],
  );

  const saveStockAlert = useCallback(
    async (newStockAlert) => {
      try {
        if (!newStockAlert.id) {
          const response = await axios.post(
            API_BASE_URL + END_POINT_SET_ALERT,
            newStockAlert,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          return response.data.success;
        } else {
          const response = await axios.put(
            API_BASE_URL + END_POINT_SET_ALERT + "/" + newStockAlert.id,
            newStockAlert,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          return response.data.success;
        }
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error adding stock to the watch list...",
        });
      }
    },
    [token],
  );

  const clearData = useCallback(() => {
    dispatch({ type: "clearing", payload: initialState });
  }, []);

  const contextValue = useMemo(
    () => ({
      watchedStocks,
      lastRefreshDatetime,
      isLoading,
      queryString,
      searchResult,
      currentStock,
      stockAlert,
      error,
      loadWatchedStock,
      searchStock,
      addToWatchList,
      removeFromWatchList,
      getStockAlert,
      saveStockAlert,
      clearData,
    }),
    [
      watchedStocks,
      lastRefreshDatetime,
      isLoading,
      queryString,
      searchResult,
      currentStock,
      stockAlert,
      error,
      loadWatchedStock,
      searchStock,
      addToWatchList,
      removeFromWatchList,
      getStockAlert,
      saveStockAlert,
      clearData,
    ],
  );

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
};

StockProvider.propTypes = {
  children: PropTypes.node,
};

export default StockContext;
