import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiderComponent from "../components/SiderComponent";
import {
  HomeScreen,
  Inventories,
  ManageStore,
  Orders,
  PromotionScreen,
  ReportScreen,
  Suppliers,
} from "../screens";
import { Affix, Layout } from "antd";
import { HeaderComponent } from "../components";
const { Content, Footer } = Layout;

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Layout
          style={{
            backgroundColor: "white !important",
          }}
        >
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content className="pt-3 container-fluid">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route>
                <Route path="/inventory" element={<Inventories />} />
                {/* <Route path='/inventory/add-product' element={<AddProduct />} />
								<Route
									path='/inventory/detail/:slug'
									element={<ProductDetail />}
								/> */}
              </Route>
              <Route path="/report" element={<ReportScreen />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/orders" element={<Orders />} />
              {/* <Route>
								<Route path='/categories' element={<Categories />} />
								<Route
									path='/categories/detail/:slug'
									element={<CategoryDetail />}
								/>
							</Route> */}

              <Route path="/manage-store" element={<ManageStore />} />
              <Route path="/promotions" element={<PromotionScreen />} />
            </Routes>
          </Content>
          <Footer className="bg-white" />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}
