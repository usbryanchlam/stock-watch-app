import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Settings } from "lucide-react";
import StockContext from "../contexts/StockContext";
import SpinningLoader from "./SpinningLoader";
import MessageDialog from "./MessageDialog";

const MSG_NO_STOCK_IN_WATCH_LIST =
  "You may search your favorite stocks at the search bar above and then add stocks to this watch list.";

function WatchList() {
  const navigate = useNavigate();
  const {
    watchedStocks,
    lastRefreshDatetime,
    isLoading,
    loadWatchedStock,
    getStockAlert,
    error,
  } = useContext(StockContext);
  const [showRefreshWarningDialog, setShowRefreshWarningDialog] =
    useState(false);
  const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);

  useEffect(
    function () {
      if (error !== "") setShowErrorMessageDialog(true);
      loadWatchedStock();
    },
    [error],
  );

  if (isLoading) return <SpinningLoader size="large" text="Fetching data..." />;

  if (!watchedStocks.length)
    return (
      <div className="m-20 h-max text-center text-lg md:text-3xl">
        {MSG_NO_STOCK_IN_WATCH_LIST}
      </div>
    );

  const handleRefresh = () => {
    const timestamp = new Date(lastRefreshDatetime); // Convert to Date object
    const now = new Date(); // Get current time

    const diff = Math.abs(now - timestamp); // Difference in milliseconds

    if (diff < 60000) {
      setShowRefreshWarningDialog(true);
    } else {
      loadWatchedStock();
    }
  };

  async function handleSetAlert(symbol) {
    const result = await getStockAlert(
      watchedStocks.filter((stock) => stock.symbol === symbol)[0],
    );
    if (!result) setShowErrorMessageDialog(true);
    else navigate("/app/setAlert");
  }

  return (
    <main className="flex-grow p-4">
      <div className="container mx-auto">
        {/* Refresh Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-400">
            Last Refresh: {lastRefreshDatetime}
          </div>
          <button
            onClick={handleRefresh}
            className="rounded-full p-2 transition-colors hover:bg-gray-800"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Stocks List */}
        <div className="h-[34rem] overflow-y-auto rounded-lg bg-gray-900">
          {/* Header */}
          <div className="grid grid-cols-5 border-b border-gray-800 p-4 text-sm font-medium md:text-base">
            <div>Symbol</div>
            <div className="text-right">Current Price</div>
            <div className="text-right">Prev. Close</div>
            <div className="text-right">Change (%)</div>
            <div className="text-center">Alert Setting</div>
          </div>

          {/* Stock Items */}
          <div className="divide-y divide-gray-800">
            {watchedStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="grid grid-cols-5 p-4 transition-colors hover:bg-gray-800"
              >
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-gray-400">
                    {stock.companyName}
                  </div>
                </div>
                <div className="text-right">
                  ${stock.currentPrice.toFixed(2)}
                </div>
                <div className="text-right">
                  ${stock.previousClose.toFixed(2)}
                </div>
                <div
                  className={`flex justify-end text-right ${stock.percentChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {stock.percentChange >= 0 ? "+" : "-"}
                  {Math.abs(stock.percentChange).toFixed(2)}%
                </div>
                <div className="items-center justify-items-center">
                  <button
                    className="flex items-center gap-2 rounded-lg px-1.5 py-0.5"
                    onClick={() => handleSetAlert(stock.symbol)}
                  >
                    <Settings className="items-center" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Refresh Warning Dialog */}
        <MessageDialog
          type="alert"
          isOpen={showRefreshWarningDialog}
          onClose={() => setShowRefreshWarningDialog(false)}
          title="Attention"
          message={`Please try again after 1 minute from the last refresh time.`}
        />
        {/* Error Message Dialog */}
        <MessageDialog
          type="alert"
          isOpen={showErrorMessageDialog}
          onClose={() => setShowErrorMessageDialog(false)}
          title="Attention"
          message={error}
        />
      </div>
    </main>
  );
}

export default WatchList;
