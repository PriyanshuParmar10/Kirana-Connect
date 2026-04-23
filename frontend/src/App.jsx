import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import MyOrdersPage from "./pages/MyOrdersPage";

function App(){
  return(
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/login" element = {<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route path="/" element = {
            <ProtectedRoute> 
              <HomePage /> 
            </ProtectedRoute>} 
          />

          <Route path="/shop/:storeId" element = {
            <ProtectedRoute>
              <ShopPage />
            </ProtectedRoute>}
          />
          
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/tracking/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;