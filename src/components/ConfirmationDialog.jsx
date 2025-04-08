import { TriangleAlert } from "lucide-react";
import PropTypes from "prop-types";

function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  closeText = "Cancel",
  confirmText = "Confirm",
  alertIconColor = "text-amber-600",
}) {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="animate-fadeIn w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="p-5">
          <div className="mb-4 flex items-center">
            <div className="mr-3 rounded-full bg-amber-100 p-2">
              <TriangleAlert size={28} className={`${alertIconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="mb-6 text-gray-600">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition duration-300 hover:bg-gray-50"
            >
              {closeText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-white transition duration-300 hover:bg-red-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  closeText: PropTypes.string,
  confirmText: PropTypes.string,
  alertIconColor: PropTypes.string,
};

export default ConfirmationDialog;
