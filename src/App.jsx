import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LoginCallback from "./components/LoginCallback";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { StockProvider } from "./contexts/StockContext";
import AppLayout from "./pages/AppLayout";
import WatchList from "./components/WatchList";
import SearchStockResult from "./components/SearchStockResult";
import SetAlert from "./components/SetAlert";
import ProfileDeletePage from "./pages/ProfileDeletePage";

function App() {
  return (
    <AuthProvider>
      <StockProvider>
        <Router
        // future={{
        //   v7_startTransition: true,
        //   v7_relativeSplatPath: true,
        // }}
        >
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/callback" element={<LoginCallback />} />
            <Route path="/profileDeleted" element={<ProfileDeletePage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="watchlist" />} />
              <Route path="watchlist" element={<WatchList />} />
              <Route path="searchResult" element={<SearchStockResult />} />
              <Route path="setAlert" element={<SetAlert />} />
              <Route
                path="/app/*"
                element={<Navigate to="watchlist" replace />}
              />
            </Route>
          </Routes>
        </Router>
      </StockProvider>
    </AuthProvider>
  );
}

export default App;
