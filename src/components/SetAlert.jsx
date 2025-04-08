import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import StockContext from "../contexts/StockContext";
import ConfirmationDialog from "./ConfirmationDialog";
import MessageDialog from "./MessageDialog";
import { ArrowLeft, Bell } from "lucide-react";

function SetAlert() {
  const navigate = useNavigate();
  const { currentStock, stockAlert, removeFromWatchList, saveStockAlert } =
    useContext(StockContext);
  const [alertActive, setAlertActive] = useState(
    !stockAlert ? false : stockAlert.isActive,
  );
  const [targetPrice, setTargetPrice] = useState(
    !stockAlert ? "" : stockAlert.targetPrice,
  );
  const [condition, setCondition] = useState(
    !stockAlert ? "ABOVE" : stockAlert.condition,
  );
  const isTriggered = !stockAlert ? false : stockAlert.isTriggered;
  const triggeredDateTime = !stockAlert
    ? null
    : new Date(stockAlert.triggeredAt).toLocaleString();

  // Dialog states
  const [showConfirmRemoveDialog, setShowConfirmRemoveDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showSaveErrorDialog, setShowSaveErrorDialog] = useState(false);
  const [showRemoveErrorDialog, setShowRemoveErrorDialog] = useState(false);

  async function handleSaveAlert() {
    const alertId = !stockAlert ? null : stockAlert.id;
    const newStockAlert = {
      id: alertId,
      stockSymbol: currentStock.symbol,
      isActive: alertActive,
      targetPrice: targetPrice,
      condition: condition,
    };

    const saveSuccess = await saveStockAlert(newStockAlert);
    if (saveSuccess) {
      setShowSuccessDialog(true);
    } else {
      setShowSaveErrorDialog(true);
    }
  }

  function handleSuccessDialogClose() {
    navigate("/app");
  }

  const handleRemoveStock = () => {
    setShowConfirmRemoveDialog(true);
  };

  async function confirmRemoveAlert() {
    const removeSuccess = await removeFromWatchList(currentStock.symbol);
    if (removeSuccess) {
      navigate("/app");
    }
  }

  const onBackClick = () => {
    navigate("/app");
  };
  const isPositive = !currentStock.percentChange
    ? false
    : currentStock.percentChange >= 0;
  return (
    <div className="p-4">
      <div className="mb-2">
        <button
          onClick={onBackClick}
          className="flex items-center text-blue-400 transition-colors hover:text-blue-300"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Watch List
        </button>
      </div>
      <div className="mb-6 rounded-lg border-white bg-gray-900 p-4 shadow">
        <div className="flex justify-between">
          <div className="text-xl font-bold">{currentStock.symbol}</div>
          <div>
            <button
              onClick={handleRemoveStock}
              className="rounded-lg bg-red-600 px-2 font-medium text-white transition duration-300 hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
        <div className="text-gray-400">{currentStock.companyName}</div>
        <div className="mt-2 flex items-center">
          <span className="text-xl font-medium" aria-label="current price">
            ${currentStock.currentPrice.toFixed(2)}
          </span>
          <span className="ml-3 text-gray-400" aria-label="privous close">
            Prev Close: ${currentStock.previousClose.toFixed(2)}
          </span>
          <span
            className={`ml-3 ${isPositive ? "text-green-600" : "text-red-600"}`}
            aria-label="percentage change"
          >
            {isPositive ? "+" : ""}
            {!currentStock.percentChange
              ? "--"
              : currentStock.percentChange.toFixed(2)}
            %
          </span>
        </div>
      </div>

      <div className="rounded-lg border-white bg-gray-900 p-4 shadow">
        <div className="flex">
          <span>
            <Bell size={20} />
          </span>
          <h3 className="mx-2 mb-4 text-lg font-semibold">Alert Settings</h3>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span>Active</span>
          <button
            onClick={() => setAlertActive(!alertActive)}
            className={`flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
              alertActive
                ? "justify-end bg-blue-600"
                : "justify-start bg-gray-300"
            }`}
          >
            <span className="mx-0.5 h-5 w-5 rounded-full bg-white"></span>
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-1 text-sm font-medium">Status</div>
          <div
            className={`text-sm ${isTriggered ? "text-green-600" : "text-gray-400"}`}
          >
            {isTriggered ? "Triggered" : "Not triggered yet"}
          </div>
          {isTriggered && triggeredDateTime && (
            <div className="text-xs text-gray-400">
              Triggered on: {triggeredDateTime}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="mb-1 block text-sm font-medium">Target Price</p>
          <input
            id="targetPrice"
            type="number"
            min="0"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            onInput={(e) => {
              if (e.target.value < 0) e.target.value = 0;
            }}
            placeholder="Enter price"
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={!alertActive}
          />
        </div>

        <div className="mb-6">
          <p className="mb-2 block text-sm font-medium">Condition</p>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                id="conditionAbove"
                type="radio"
                value="above"
                checked={condition === "ABOVE"}
                onChange={() => setCondition("ABOVE")}
                className="mr-2"
                disabled={!alertActive}
              />
              {/* */}Above
            </label>
            <label className="flex items-center">
              <input
                id="conditionBelow"
                type="radio"
                value="below"
                checked={condition === "BELOW"}
                onChange={() => setCondition("BELOW")}
                className="mr-2"
                disabled={!alertActive}
              />
              {/* */}Below
            </label>
          </div>
        </div>
        <button
          onClick={handleSaveAlert}
          className="w-32 rounded-lg bg-blue-600 py-1 font-medium text-white transition duration-300 hover:bg-blue-700"
        >
          Save Alert
        </button>
      </div>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmRemoveDialog}
        onClose={() => setShowConfirmRemoveDialog(false)}
        onConfirm={confirmRemoveAlert}
        title="Remove Alert"
        message={`Are you sure you want to remove this stock from the Watch List?`}
      />
      {/* Success Dialog */}
      <MessageDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          handleSuccessDialogClose();
        }}
        title="Alert Saved"
        message={`Price alert for ${currentStock.symbol} has been saved successfully.`}
      />
      {/* Save Error Dialog */}
      <MessageDialog
        type="alert"
        isOpen={showSaveErrorDialog}
        onClose={() => setShowSaveErrorDialog(false)}
        title="Error"
        message={`There was an error saving alert setting!`}
      />
      {/* Remove Error Dialog */}
      <MessageDialog
        type="alert"
        isOpen={showRemoveErrorDialog}
        onClose={() => setShowRemoveErrorDialog(false)}
        title="Error"
        message={`There was an error removing stock from watch list!`}
      />
    </div>
  );
}

export default SetAlert;
