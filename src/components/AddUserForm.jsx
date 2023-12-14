import React, {useState} from "react";
import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const {Option} = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const AddUserForm = ({handleCancelAddUserForm}) => {
  const [form] = Form.useForm();
  const token = Cookies.get("token") || "";
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/add`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            // Add any other headers you need
          },
        }
      );

      // Handle different status codes or responses as needed
      if (response.status === 200) {
        toast.success("User added successfully!");
        handleReset();
        handleCancelAddUserForm();
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Failed to create user:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const prefixSelector = (
    <Form.Item name="countryCode" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="63">+63</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="mx-auto p-4">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          type: "student",
          countryCode: "63",
        }}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail",
            },
            {
              required: true,
              message: "Please input your E-mail",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="type"
          label="User Type"
          rules={[
            {
              required: true,
              message: "Please select a user type",
            },
          ]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="student">Student</Option>
            <Option value="professor">Professor</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.type !== currentValues.type
          }
        >
          {({getFieldValue}) =>
            getFieldValue("type") === "student" ? (
              <Form.Item
                name="degreeCode"
                label="Degree"
                rules={[
                  {
                    required: true,
                    message: "Please select a degree",
                  },
                ]}
              >
                <Select placeholder="">
                  <Option value="BSCS">
                    Bachelor of Science in Computer Science
                  </Option>
                  <Option value="BAE">Bachelor of Arts in English</Option>
                  <Option value="BBA">
                    Bachelor of Business Administration
                  </Option>
                  <Option value="BSN">Bachelor of Science in Nursing</Option>
                  <Option value="BAP">Bachelor of Arts in Psychology</Option>
                  <Option value="BSIT">
                    Bachelor of Science in Information Technology
                  </Option>
                </Select>
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: "Please input your phone number",
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            {
              required: true,
              message: "Please input a first name",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            {
              required: true,
              message: "Please input a last name",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: "Please select gender",
            },
          ]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default AddUserForm;
