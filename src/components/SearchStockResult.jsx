import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StockContext from "../contexts/StockContext";
import SpinningLoader from "./SpinningLoader";
import MessageDialog from "./MessageDialog";
import { ArrowLeft, SquarePlus } from "lucide-react";
import AuthContext from "../contexts/AuthContext";

// Sample stock data
// const allStocks = [
//   {
//     logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.png",
//     code: "AAPL",
//     name: "Apple Inc.",
//     currentPrice: 187.68,
//     previousClose: 185.92,
//     percentChange: 0.95,
//     volume: "55.2M",
//     marketCap: "2.91T",
//     sector: "Technology",
//   },
//   {
//     logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/MSFT.png",
//     code: "MSFT",
//     name: "Microsoft Corporation",
//     currentPrice: 417.88,
//     previousClose: 415.32,
//     percentChange: 0.62,
//     volume: "22.3M",
//     marketCap: "3.10T",
//     sector: "Technology",
//   },
//   {
//     logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/GOOG.png",
//     code: "GOOGL",
//     name: "Alphabet Inc.",
//     currentPrice: 172.63,
//     previousClose: 175.09,
//     percentChange: -1.4,
//     volume: "28.7M",
//     marketCap: "2.15T",
//     sector: "Technology",
//   },
//   {
//     logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AMZN.png",
//     code: "AMZN",
//     name: "Amazon.com Inc.",
//     currentPrice: 183.2,
//     previousClose: 180.75,
//     percentChange: 1.35,
//     volume: "33.5M",
//     marketCap: "1.89T",
//     sector: "Consumer Cyclical",
//   },
//   {
//     logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/TSLA.png",
//     code: "TSLA",
//     name: "Tesla Inc.",
//     currentPrice: 172.82,
//     previousClose: 177.55,
//     percentChange: -2.66,
//     volume: "94.1M",
//     marketCap: "550.32B",
//     sector: "Automotive",
//   },
//   {
//     logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/FB.png",
//     code: "META",
//     name: "Meta Platforms Inc.",
//     currentPrice: 478.22,
//     previousClose: 472.67,
//     percentChange: 1.17,
//     volume: "18.9M",
//     marketCap: "1.22T",
//     sector: "Technology",
//   },
//   {
//     logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/NFLX.png",
//     code: "NFLX",
//     name: "Netflix Inc.",
//     currentPrice: 628.55,
//     previousClose: 622.83,
//     percentChange: 0.92,
//     volume: "3.2M",
//     marketCap: "272.55B",
//     sector: "Entertainment",
//   },
//   {
//     logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/NVDA.png",
//     code: "NVDA",
//     name: "NVIDIA Corporation",
//     currentPrice: 896.48,
//     previousClose: 880.1,
//     percentChange: 1.86,
//     volume: "42.6M",
//     marketCap: "2.21T",
//     sector: "Technology",
//   },
// ];

// const searchQuery = "A";

// Filter stocks based on search query (case insensitive)
// const results = allStocks.filter(
//   (stock) =>
//     stock.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
// );

function SearchStockResult() {
  const {
    watchedStocks,
    isLoading,
    queryString,
    searchResult,
    loadWatchedStock,
    addToWatchList,
  } = useContext(StockContext);
  const { token } = useContext(AuthContext);
  const [showAlertMessageDialog, setShowAlertMessageDialog] = useState(false);
  const [showSuccessMessageDialog, setShowSuccessMessageDialog] =
    useState(false);
  const [refreshWatchedStock, setRefreshWatchedStock] = useState(false);
  const [tempAddedStockList, setTempAddedStockList] = useState([]);
  const tempAddedStockListRef = useRef([]);
  const navigate = useNavigate();

  if (isLoading)
    return <SpinningLoader size="large" text="Loading search result..." />;

  const onBackClick = () => {
    if (refreshWatchedStock) loadWatchedStock(token);
    navigate("/app");
  };

  async function handleAddWatchList(symbol) {
    const existInWatchedStocks = watchedStocks.filter(
      (stock) => stock.symbol === symbol,
    );
    if (
      existInWatchedStocks.length > 0 ||
      tempAddedStockListRef.current.includes(symbol)
    )
      setShowAlertMessageDialog(true);
    else {
      const addResult = await addToWatchList(token, symbol);
      if (addResult) {
        setShowSuccessMessageDialog(true);
        if (!refreshWatchedStock) setRefreshWatchedStock(true);
        setTempAddedStockList([...tempAddedStockList, symbol]);
        tempAddedStockListRef.current = [
          ...tempAddedStockListRef.current,
          symbol,
        ];
        // console.log(tempAddedStockListRef.current);
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
            message={`This stock is already in the watch list.`}
          />
          <MessageDialog
            type="check"
            isOpen={showSuccessMessageDialog}
            onClose={() => setShowSuccessMessageDialog(false)}
            title="Information"
            message={`Added to the watch list successfully.`}
          />
        </div>
      )}
    </>
  );
}

export default SearchStockResult;
