import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";

export default function Routers() {
  return 1 < 2 ? <AuthRouter /> : <MainRouter />;
}
