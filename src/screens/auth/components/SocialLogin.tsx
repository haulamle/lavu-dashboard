import { Button } from "antd";

export default function SocialLogin() {
  return (
    <Button
      style={{ width: "100%" }}
      size="large"
      icon={
        <img
          width={24}
          height={24}
          src="https://img.icons8.com/color/48/google-logo.png"
          alt="google-logo"
        />
      }
    >
      Google
    </Button>
  );
}
