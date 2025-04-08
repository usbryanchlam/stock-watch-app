import { createContext, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const StockContext = createContext();

const initialState = {
  watchedStocks: [],
  lastRefreshDatetime: null,
  isLoading: false,
  queryString: "",
  searchResult: [],
  currentStock: JSON.parse(sessionStorage.getItem("currentStock")) || {},
  stockAlert: JSON.parse(sessionStorage.getItem("stockAlert")) || null,
  error: "",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const END_POINT_WATCHLIST = import.meta.env.VITE_END_POINT_WATCHLIST;
const END_POINT_SEARCH_STOCK = import.meta.env.VITE_END_POINT_SEARCH_STOCK;
const END_POINT_SET_ALERT = import.meta.env.VITE_END_POINT_SET_ALERT;

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

  async function loadWatchedStock() {
    dispatch({ type: "loading" });
    try {
      const response = await axios.get(API_BASE_URL + END_POINT_WATCHLIST, {
        withCredentials: true,
      });
      const responseData = response.data.data;
      dispatch({ type: "watchedStocks/loaded", payload: responseData });
      const localeString = new Date(response.data.timestamp).toLocaleString();
      dispatch({ type: "refreshing", payload: localeString });

      sessionStorage.removeItem("currentStock");
      sessionStorage.removeItem("stockAlert");
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading watched stocks...",
      });
    }
  }

  async function searchStock(queryText) {
    if (!queryText && queryText.length < 3) return;
    dispatch({ type: "loading" });
    try {
      const response = await axios.get(API_BASE_URL + END_POINT_SEARCH_STOCK, {
        withCredentials: true,
        params: {
          query: `${queryText}`,
        },
      });

      const responseData = response.data.data;
      dispatch({ type: "searched", payload: responseData });
      dispatch({ type: "setting/queryText", payload: queryText });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading search stock result...",
      });
    }
  }

  async function addToWatchList(symbol) {
    try {
      const response = await axios.post(
        API_BASE_URL + END_POINT_WATCHLIST,
        { symbol: symbol },
        {
          withCredentials: true,
        },
      );

      return response.data.success;
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error adding stock to the watch list...",
      });
    }
  }

  async function removeFromWatchList(symbol) {
    try {
      const response = await axios.delete(
        API_BASE_URL + END_POINT_WATCHLIST + "/" + symbol,
        {
          withCredentials: true,
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
  }

  async function getStockAlert(stock) {
    try {
      const response = await axios.get(
        API_BASE_URL + END_POINT_SET_ALERT + "/" + stock.symbol,
        {
          withCredentials: true,
        },
      );

      const responseData = response.data.data;

      sessionStorage.setItem("currentStock", JSON.stringify(stock));
      sessionStorage.setItem("stockAlert", JSON.stringify(responseData));

      dispatch({ type: "viewing/stock", payload: stock });
      dispatch({ type: "setting/alert", payload: responseData });
      return response.data.success;
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error getting existing alert of the stock...",
      });
    }
  }

  async function saveStockAlert(newStockAlert) {
    try {
      if (!newStockAlert.id) {
        const response = await axios.post(
          API_BASE_URL + END_POINT_SET_ALERT,
          newStockAlert,
          {
            withCredentials: true,
          },
        );
        return response.data.success;
      } else {
        const response = await axios.put(
          API_BASE_URL + END_POINT_SET_ALERT + "/" + newStockAlert.id,
          newStockAlert,
          {
            withCredentials: true,
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
  }

  function clearData() {
    sessionStorage.removeItem("currentStock");
    sessionStorage.removeItem("stockAlert");
    dispatch({ type: "clearing", payload: initialState });
  }

  return (
    <StockContext.Provider
      value={{
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
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

StockProvider.propTypes = {
  children: PropTypes.node,
};

export default StockContext;
