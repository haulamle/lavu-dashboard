import { ConfigProvider, message } from "antd";
import "./App.css";
import Routers from "./routers/Routers";
import { Provider } from "react-redux";
import store from "./reduxs/store";

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {},
      }}
    >
      <Provider store={store}>
        <Routers />
      </Provider>
    </ConfigProvider>
  );
}

export default App;
