import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Login as loginAction } from '../api-action/AuthActions';
import { RootState } from '../redux/reducers';

const Login: React.FC = () => {

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false); // <-- Loading state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData, userLogError } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      // Store the token in localStorage
      if (userData.token) {
        setLoading(false); // stop loading
        localStorage.setItem('token', userData.token);
        messageApi.success('Login Successful!');
        setTimeout(() => {
          navigate('/users');
        }, 2000);
      }
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (userLogError && Object.keys(userLogError).length > 0) {
      messageApi.error('Login failed: ' + (typeof userLogError === 'string' ? userLogError : 'Invalid credentials'));
      setLoading(false); // stop loading
    }
  }, [userLogError]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true); // start loading
    dispatch(loginAction(values) as any);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#e0e0e0",
      }}
    >
      {contextHolder}
      <Card style={{ width: 500, borderRadius: 8 }}>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          {/* Email */}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              iconRender={() => null}
            />
          </Form.Item>

          {/* Remember Me */}
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              size="large"
              loading={loading} // <-- Set loading prop here
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
