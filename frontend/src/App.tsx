import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./store/store";
import { selectAuth } from "./store/auth/authSlice";
import { useEffect } from "react";
import { profileThunk } from "./store/auth/authThunk";
import LoadingSpinner from "./components/LoadingSpinner";
import Admin from "./pages/Admin";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseCancel from "./pages/PurchaseCancel";
import Category from "./pages/Category";
import Cart from "./pages/Cart";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector(selectAuth);

  // Only run on mount
  useEffect(() => {
    dispatch(profileThunk());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={
              user?.role === "admin" ? <Admin /> : <Navigate to="/login" />
            }
          />
          <Route path="/category/:category" element={<Category />} />
          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccess /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancel /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}
export default App;
