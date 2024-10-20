import { Button } from "antd";
import { useDispatch } from "react-redux";
import { removeAuth } from "../reduxs/reducers/authReducer";

export const HomeScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeAuth());
  };

  return (
    <div>
      <Button onClick={handleLogout}>Log out</Button>
    </div>
  );
};
