import React, {useState} from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Card,
  Space,
  Table,
  Tag,
  Modal,
  Input,
  Col,
  Row,
} from "antd";
import axios from "axios";
import OpenAI from "openai";
import {defaultPrompt} from "../lib/prompts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import logo from "../assets/images/quiz-logo 2.png";
import Cookies from "js-cookie";
import {useSWRWithAuth} from "../lib/auth";
import {useNavigate} from "react-router-dom";
import useSWR from "swr";
import QuizList from "./QuizList";

const {Search} = Input;

const {Header, Sider, Content} = Layout;

const App = () => {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const {
    token: {colorBgContainer},
  } = theme.useToken();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [completionResult, setCompletionResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState(Cookies.get("token") || "");
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/admin/user`;

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
  const {data: user, error, isLoading} = useSWR(apiUrl, fetcher);

  if (error) return navigate("/");
  if (isLoading) return "Loading...";

  if (isLoading) {
    if (!user) {
      navigate("/");
    }
    if (!user) return <></>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt) {
      setErrorMessage("Course cannot be blank. Please enter a valid course.");
      return;
    }

    try {
      setLoading(true);

      const completion = await openai.chat.completions.create({
        messages: [
          {role: "system", content: defaultPrompt},
          {
            role: "user",
            content: `Generate 2 questions as multiple choice for a college-level ${prompt} course with answers. Put each multiple choice in either a bulleted list or ordered list.`,
          },
        ],
        model: "gpt-3.5-turbo",
        // stream: true,
      });

      setCompletionResult(completion.choices[0].message.content);

      if (completion.choices[0].message.content) {
        try {
          const quizResponse = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/admin/create/quiz`,
            {
              prompt: prompt,
              completionResult: completion.choices[0].message.content,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                // Add any other headers you need
              },
            }
          );

          // Handle different status codes or responses as needed
          if (quizResponse.status === 200) {
            console.log("Quiz created successfully");
          } else {
            console.error("Unexpected response:", quizResponse);
          }
        } catch (error) {
          console.error("Failed to create quiz:", error.message);
        }
      }

      setErrorMessage("");
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    setLoading(false);
    setPrompt("");
    setErrorMessage("");
    setCompletionResult("");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setLoading(false);
    setPrompt("");
    setErrorMessage("");
    setCompletionResult("");
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Score",
      dataIndex: "age",
      key: "age",
    },

    {
      title: "Categories",
      key: "tags",
      dataIndex: "tags",
      render: (_, {tags}) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "IT") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>View Results</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      tags: ["IT", "Accounting"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      tags: ["Arts"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      tags: ["IT", "Arts"],
    },
  ];

  return (
    <Layout>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <img src={logo} width="100px" />
          <p className="logo-text">QuizR - Generator</p>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "Quiz List",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "Student List",
            },
          ]}
        />
      </Sider>
      <Layout className="bg-default">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Row gutter={16}>
            <Col span={12} className="gutter-row">
              <Card
                style={{
                  marginBottom: "30px",
                }}
                className="card--bg mb-28"
              >
                <h1>Welcome Back, {user?.username}</h1>
                <p>Here are some of the updates on your portal.</p>

                {/* Modal */}

                <Button type="primary" onClick={showModal}>
                  Generate Quiz
                </Button>
                <form>
                  <Modal
                    open={isModalOpen}
                    onCancel={handleCancel}
                    title="Enter General Quiz Topic"
                    footer={[]}
                  >
                    <Input
                      showCount
                      maxLength={20}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      status={errorMessage ? "error" : ""}
                      placeholder={errorMessage}
                    />

                    <Markdown remarkPlugins={[remarkGfm]}>
                      {completionResult}
                    </Markdown>

                    <Button
                      key="submit"
                      type="primary"
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{marginTop: "10px"}}
                    >
                      {loading ? "Generating..." : "Submit"}
                    </Button>
                  </Modal>
                </form>
              </Card>
              <Card
                style={{
                  marginBottom: "30px",
                }}
                className="mb-28"
              >
                <h2>Student List</h2>
                <Table columns={columns} dataSource={data} />
              </Card>
            </Col>
            <Col span={12} className="gutter-row">
              <Card
                style={{
                  marginBottom: "30px",
                }}
                className="mb-28"
              >
                <h2>Quiz List</h2>
                <QuizList columns={columns} dataSource={data} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
