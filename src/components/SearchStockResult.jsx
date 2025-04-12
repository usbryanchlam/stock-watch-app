import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StockContext from "../contexts/StockContext";
import SpinningLoader from "./SpinningLoader";
import MessageDialog from "./MessageDialog";
import { ArrowLeft, SquarePlus } from "lucide-react";

const WATCH_LIST_LIMIT = 20;

function SearchStockResult() {
  const {
    watchedStocks,
    isLoading,
    queryString,
    searchResult,
    addToWatchList,
  } = useContext(StockContext);
  const [showAlertMessageDialog, setShowAlertMessageDialog] = useState(false);
  const [showSuccessMessageDialog, setShowSuccessMessageDialog] =
    useState(false);
  const [showExceedNumOfStockLimitDialog, setShowExceedNumOfStockLimitDialog] =
    useState(false);
  const [refreshWatchedStock, setRefreshWatchedStock] = useState(false);
  const [tempAddedStockList, setTempAddedStockList] = useState([]);
  const tempAddedStockListRef = useRef([]);
  const navigate = useNavigate();

  if (isLoading)
    return <SpinningLoader size="large" text="Loading search result..." />;

  const onBackClick = () => {
    navigate("/app");
  };

  async function handleAddWatchList(symbol) {
    const existInWatchedStocks = watchedStocks.filter(
      (stock) => stock.symbol === symbol,
    );
    if (
      existInWatchedStocks.length > 0 ||
      tempAddedStockListRef.current.includes(symbol)
    ) {
      setShowAlertMessageDialog(true);
    } else if (watchedStocks.length >= WATCH_LIST_LIMIT) {
      setShowExceedNumOfStockLimitDialog(true);
      return;
    } else {
      const addResult = await addToWatchList(symbol);
      if (addResult) {
        setShowSuccessMessageDialog(true);
        if (!refreshWatchedStock) setRefreshWatchedStock(true);
        setTempAddedStockList([...tempAddedStockList, symbol]);
        tempAddedStockListRef.current = [
          ...tempAddedStockListRef.current,
          symbol,
        ];
      }
    }
  }
  return (
    <>
      <div className="mb-2">
        <button
          onClick={onBackClick}
          className="flex items-center text-blue-400 transition-colors hover:text-blue-300"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Watch List
        </button>
      </div>

      <h2 className="mb-2 p-4 text-2xl font-bold">
        Search Results for "{queryString}"
      </h2>

      {searchResult.length === 0 ? (
        <div className="rounded-lg bg-gray-900 p-8 text-center">
          <p className="mb-2 text-gray-400">
            No stocks found matching "{queryString}"
          </p>
          <p className="text-sm">
            Try another search term or check the stock code
          </p>
        </div>
      ) : (
        <div className="h-[32rem] overflow-y-auto rounded-lg bg-gray-900">
          {/* Detailed Results Header */}
          <div className="grid grid-cols-5 border-b border-gray-800 p-4 text-lg font-medium">
            <div className="">Logo</div>
            <div className="col-span-2">Stock</div>
            <div className="text-left">Industry</div>
            <div className="text-center">Add to Watch List</div>
          </div>
          {/* Results List */}
          <div className="divide-y divide-gray-800">
            {searchResult.map((stock) => (
              <div
                key={stock.symbol}
                className="grid grid-cols-5 p-4 transition-colors hover:bg-gray-800"
              >
                <div>
                  {stock.logo === "" ? (
                    <p className="inline-block size-10 rounded-full">N/A</p>
                  ) : (
                    <img
                      className="inline-block size-10 rounded-full"
                      src={stock.logo}
                      alt={stock.name}
                    />
                  )}
                </div>
                <div className="col-span-2">
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-gray-400">{stock.name}</div>
                </div>

                <div className="self-center text-left">{stock.industry}</div>
                <div className="justify-items-center self-center text-center">
                  <button
                    className="flex gap-2 rounded-lg bg-green-600 px-1.5 py-0.5 transition-colors hover:bg-green-700"
                    onClick={() => handleAddWatchList(stock.symbol)}
                  >
                    <SquarePlus className="items-center" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Message Dialog */}
          <MessageDialog
            type="alert"
            isOpen={showAlertMessageDialog}
            onClose={() => setShowAlertMessageDialog(false)}
            title="Attention"
            message="This stock is already in the watch list."
          />
          <MessageDialog
            type="check"
            isOpen={showSuccessMessageDialog}
            onClose={() => setShowSuccessMessageDialog(false)}
            title="Information"
            message="Added to the watch list successfully."
          />
          <MessageDialog
            type="alert"
            isOpen={showExceedNumOfStockLimitDialog}
            onClose={() => setShowExceedNumOfStockLimitDialog(false)}
            title="Attention"
            message="The watch list is full. For demonstration purpose, the limit is set to 20."
          />
        </div>
      )}
    </>
  );
}

export default SearchStockResult;
