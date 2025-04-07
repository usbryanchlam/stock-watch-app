import { useEffect } from "react";
import { CircleCheck, CircleAlert, X } from "lucide-react";

function MessageDialog({ type = "check", isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  // Auto-close after 3 seconds
  // useEffect(() => {
  //   if (isOpen) {
  //     const timer = setTimeout(() => {
  //       onClose();
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isOpen, onClose]);

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

export default MessageDialog;
