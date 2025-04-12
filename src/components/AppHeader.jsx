import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StockContext from "../contexts/StockContext";
import MessageDialog from "./MessageDialog";
import ConfirmationDialog from "./ConfirmationDialog";

function AppHeader() {
  const [queryText, setQueryText] = useState("");
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showConfirmDeleteAccount, setShowConfirmDeleteAccount] =
    useState(false);

  const { id, email, name, picture, signout, error, deleteUser } =
    useContext(AuthContext);
  const { searchStock, clearData } = useContext(StockContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setShowConfirmDeleteAccount(true);
  };

  function justSignOut() {
    clearData();
    signout();
    navigate("/");
  }

  async function handleConfirmDeleteAccount() {
    clearData();

    const deleteSuccess = await deleteUser(id, email);
    if (deleteSuccess) navigate("/profileDeleted");
    else alert(error);
  }

  const handleSearch = () => {
    if (!queryText || queryText.length < 3) setShowMessageDialog(true);
    else {
      setQueryText("");
      searchStock(queryText);
      navigate("searchResult");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="border-b border-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            className="inline-block size-10 rounded-full ring-2 ring-white"
            src={picture}
            alt={name}
          />
          <span className="font-medium">{name}</span>
        </div>
        <div className="relative w-64 md:w-80">
          <input
            id="searchbar"
            type="text"
            placeholder="Search stocks..."
            value={queryText}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 pr-10 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Search
            className="absolute top-2.5 right-3 text-gray-400"
            size={18}
            onClick={handleSearch}
            aria-label="Search"
          />
        </div>

        <button
          id="signOutBtn"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 transition-colors hover:bg-indigo-700"
          onClick={handleSignOut}
          aria-label="Sign Out"
        >
          <LogOut size={18} />
          {/* <span>Sign Out</span> */}
        </button>
        {/* Message Dialog */}
        <MessageDialog
          type="alert"
          isOpen={showMessageDialog}
          onClose={() => setShowMessageDialog(false)}
          title="Attention"
          message={`Please input at least 2 letters`}
        />
        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showConfirmDeleteAccount}
          onClose={() => {
            setShowConfirmDeleteAccount(false);
            justSignOut();
          }}
          onConfirm={() => {
            setShowConfirmDeleteAccount(false);
            handleConfirmDeleteAccount();
          }}
          title="Delete Profile and Sign Out"
          message={`Do you want to delete your profile information from our database and sign out?`}
          closeText="No, just sign out"
          confirmText="Yes"
          alertIconColor="text-red-600"
        />
      </div>
    </header>
  );
}

export default AppHeader;
