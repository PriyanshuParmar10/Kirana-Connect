import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";

function App(){
  return(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element = {<LoginPage/>}/>
          <Route path="/" element = {<HomePage />} />
          <Route path="/shop/:storeId" element = {<ShopPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;