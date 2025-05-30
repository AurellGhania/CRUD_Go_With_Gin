import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppHeaderLayout from "./layout/AppHeaderLayout";
import AppLayout from "./layout/AppLayout";
import { ProtectedRoute } from "./pages/AuthPages/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Blank from "./pages/Blank";
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import Home from "./pages/Dashboard/Home";
import LandingPage from "./pages/Dashboard/LandingPage";
import CategoryForm from "./pages/Forms/CategoryForm";
import ProductForm from "./pages/Forms/ProductForm";
import SliderForm from "./pages/Forms/SliderForm";
import VoucherForm from "./pages/Forms/VoucherForm";
import NotFound from "./pages/OtherPage/NotFound";
import CategoryTable from "./pages/Tables/CategoryTable";
import ProductTable from "./pages/Tables/ProductTable";
import SliderTable from "./pages/Tables/SliderTable";
import UserTable from "./pages/Tables/UserTable";
import VoucherTable from "./pages/Tables/VoucherTable";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppHeaderLayout />}>
            <Route path="/landing-page" element={<LandingPage />} />
          </Route>
          {/* Dashboard Layout */}

          <Route
            element={
               <ProtectedRoute allowedRole="crm">
                <AppLayout />
               </ProtectedRoute>
            }
              >
            
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />

            {/* Update */}
            <Route path="/products/update-product/:ID" element={<ProductForm />} />
            <Route path="/categories/update-category/:ID" element={<CategoryForm />} />
            <Route path="/sliders/update-ads/:ID" element={<SliderForm />} />
            <Route path="/vouchers/update-voucher/:ID" element={<VoucherForm />} />



            {/* Forms */}
            <Route path="/product-form" element={<ProductForm />} />
            <Route path="/voucher-form" element={<VoucherForm />} />
            <Route path="/slider-form" element={<SliderForm />} />
            <Route path="/category-form" element={<CategoryForm />} />

            {/* Tables */}
            <Route path="/slider-tables" element={<SliderTable />} />
            <Route path="/category-tables" element={<CategoryTable />} />
            <Route path="/voucher-tables" element={<VoucherTable />} />
            <Route path="/user-tables" element={<UserTable />} />
            <Route path="/product-table" element={<ProductTable />} />

            {/* Ui Elements */}‚
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
