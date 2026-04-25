import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// routes for customers
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import MyOrdersPage from "./pages/MyOrdersPage";

// routes for storeOwners
import StoreSetupPage from "./pages/StoreSetupPage";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import StoreOrdersPage from "./pages/StoreOrdersPage";
import StoreProductsPage from "./pages/StoreProductsPage";

// routes for deliveryPartners
import DeliverySetupPage from "./pages/DeliverySetupPage";
import DeliveryDashboard from "./pages/DeliveryDashboard";

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


          {/* store owners */}
          <Route path="/store/setup" element={<ProtectedRoute><StoreSetupPage /></ProtectedRoute>} />
          <Route path="/store/dashboard" element={<ProtectedRoute><StoreOwnerDashboard /></ProtectedRoute>} />
          <Route path="/store/orders" element={<ProtectedRoute><StoreOrdersPage /></ProtectedRoute>} />
          <Route path="/store/products" element={<ProtectedRoute><StoreProductsPage /></ProtectedRoute>} />

          {/* delivery partners */}
          <Route path="/delivery/setup" element={<ProtectedRoute><DeliverySetupPage /></ProtectedRoute>} />
          <Route path="/delivery/dashboard" element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;