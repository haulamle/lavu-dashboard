import { useDispatch, useSelector } from "react-redux";
import { authSeletor, AuthState } from "../reduxs/reducers/authReducer";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";

export default function Routers() {
  const auth: AuthState = useSelector(authSeletor);
  const dispatch = useDispatch();

  return !auth.token ? <AuthRouter /> : <MainRouter />;
}
