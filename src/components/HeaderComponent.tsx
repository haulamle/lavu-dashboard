import { Avatar, Button, Dropdown, Input, MenuProps, Space } from "antd";
import { Notification, SearchNormal1 } from "iconsax-react";
import { colors } from "../constants/colors";
import { auth } from "../firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authSeletor, removeAuth } from "../reduxs/reducers/authReducer";
import { signOut } from "firebase/auth";

const HeaderComponent = () => {
  const user = useSelector(authSeletor);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: async () => {
        signOut(auth);
        dispatch(removeAuth());
        localStorage.clear();

        navigate("/");
      },
    },
  ];

  return (
    <div className="p-2 row bg-white m-0">
      <div className="col">
        <Input
          placeholder="Search product, supplier, order"
          style={{
            borderRadius: 100,
            width: "50%",
          }}
          size="large"
          prefix={<SearchNormal1 className="text-muted" size={20} />}
        />
      </div>
      <div className="col text-right">
        <Space>
          <Button
            type="text"
            icon={<Notification size={22} color={colors.gray600} />}
          />
          <Dropdown menu={{ items }}>
            <Avatar
              style={{
                borderColor: colors.primary500,
                borderWidth: 1,
                borderBlockStyle: "solid",
              }}
              src={
                user.photoUrl ??
                "https://firebasestorage.googleapis.com/v0/b/kanban-28821.appspot.com/o/admin.png?alt=media&token=b131bc2a-6a5e-47c7-9f6a-8b29eb31eecb"
              }
              size={40}
            />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default HeaderComponent;
