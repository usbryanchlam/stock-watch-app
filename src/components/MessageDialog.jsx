import PropTypes from "prop-types";
import { CircleCheck, CircleAlert, X } from "lucide-react";

function MessageDialog({ type = "check", isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex items-start justify-center px-4">
      <div className="animate-slideDown flex w-full max-w-md items-start rounded-lg bg-white shadow-lg">
        <div className="flex-shrink-0 rounded-l-lg p-4">
          {type === "check" ? (
            <CircleCheck className="text-green-600" />
          ) : (
            <CircleAlert className="text-red-600" />
          )}
        </div>
        <div className="flex-grow p-4">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

MessageDialog.propTypes = {
  type: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default MessageDialog;
