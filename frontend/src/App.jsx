import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
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
        <Routes>
          {/* public routes */}
          <Route path="/login" element = {<LoginPage/>}/>

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