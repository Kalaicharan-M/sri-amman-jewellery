import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { GoldRate } from "./pages/GoldRate";
import { Products } from "./pages/Products";
import { ProductDetails } from "./pages/ProductDetails";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminProducts } from "./pages/admin/Products";
import { AdminGoldRate } from "./pages/admin/GoldRate";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "gold-rate", Component: GoldRate },
      { path: "products", Component: Products },
      { path: "products/:id", Component: ProductDetails },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/products", Component: AdminProducts },
      { path: "admin/gold-rate", Component: AdminGoldRate },
    ],
  },
]);
