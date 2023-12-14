import {useEffect, useState} from "react";
import {Button, Checkbox, Form, Input, Col, Row, Card} from "antd";
import logo from "../assets/images/quiz-logo 2.png";
import study from "../assets/images/1_1.png";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import toast, {Toaster} from "react-hot-toast";
import useSWR from "swr";

const Login = () => {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/admin/user`;
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [errorMessage, setErrorMessage] = useState("error");
  let navigate = useNavigate();
  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Add any other headers you need
        },
      })
      .then((res) => res.data.user);
  const {data: user} = useSWR(apiUrl, fetcher);

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const onFinish = async (values) => {
    try {
      // Make a request to your authentication endpoint using Axios
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/admin/login`,
        values
      );

      if (response.status === 200) {
        Cookies.set("token", response.data.token, {
          sameSite: "None",
          secure: process.env.REACT_APP_NODE_ENV == "production",
          path: "/",
          domain:
            process.env.REACT_APP_NODE_ENV == "production"
              ? `.${process.env.REACT_APP_CLIENT_URL}`
              : null,
          expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
        });

        navigate("/home");
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.error(error.response.data.message);
      } else if (error.response.status === 500) {
        toast.error(error.response.data.message);
      }

      console.error("Login failed:", error.message);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Row gutter={16} className="h-full">
        <Col
          span={12}
          className="login-left--bg gutter-row flex flex-wrap justify-center content-center lg:flex-col text-center "
        ></Col>
        <Col
          span={12}
          className="gutter-row login-right--bg flex flex-wrap justify-center content-center lg:flex-col w-full h-full text-center"
        >
          <img src={logo} alt="logo" className="logo" />
          <h1 className="mb-0 mt-0">Welcome Back!</h1>
          <p className="mb-6">Login your credentials</p>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};
export default Login;
