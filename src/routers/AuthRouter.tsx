import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../screens/auth/Login";
import SignUp from "../screens/auth/SignUp";
import { Typography } from "antd";

const { Title } = Typography;

export default function AuthRouter() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col d-none d-lg-block text-center"
          style={{ marginTop: "15%" }}
        >
          <img
            className="mb-4"
            src="https://firebasestorage.googleapis.com/v0/b/kanban-28821.appspot.com/o/logo-web.png?alt=media&token=eaaf7b15-f82b-45e3-aa8e-39fef1011200"
            alt="logo"
            style={{ width: 256, objectFit: "cover" }}
          />
          <Title>KanBan</Title>
        </div>
        <div className="col content-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}
