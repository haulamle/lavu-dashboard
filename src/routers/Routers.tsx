import { useDispatch, useSelector } from "react-redux";
import {
  addAuth,
  authSeletor,
  AuthState,
} from "../reduxs/reducers/authReducer";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { useEffect, useState } from "react";
import { localDataNames } from "../constants/appInfos";
import { Spin } from "antd";

export default function Routers() {
  const [isLoading, setIsLoading] = useState(false);

  const auth: AuthState = useSelector(authSeletor);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const res = localStorage.getItem(localDataNames.authData);
    res && dispatch(addAuth(JSON.parse(res)));
  };

  return isLoading ? <Spin /> : !auth.token ? <AuthRouter /> : <MainRouter />;
}
