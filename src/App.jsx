import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Collection from "./pages/Collection";
import ProductDetails from "./components/Products/ProductDetails";
import CheckOut from "./components/Cart/CheckOut";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyorderPage from "./pages/MyorderPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagemant from "./components/Admin/UserManagemant";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
//store
import store from "./redux/store";
import { Provider } from "react-redux";
import ProtectedRoutes from "./components/Common/protectedRoutes";
import CreateProductPage from "./components/Admin/CreateProductPage";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* user layout  */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="collections/:collection" element={<Collection />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="checkout" element={<CheckOut />} />
              <Route
                path="order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="order/:id" element={<OrderDetailsPage />} />
              <Route path="my-orders" element={<MyorderPage />} />
            </Route>
            {/* admin layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoutes role="admin">
                  <AdminLayout />
                </ProtectedRoutes>
              }
            >
              <Route index element={<AdminHomePage />} />
              <Route path="dashboard" element={<AdminHomePage />} />
              <Route path="users" element={<UserManagemant />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/create" element={<CreateProductPage />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
