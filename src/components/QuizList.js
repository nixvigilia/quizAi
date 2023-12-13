import {useEffect, useState} from "react";
import {Table, Space, Button, Modal} from "antd";
import axios from "axios";
import useSWR from "swr";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const QuizList = () => {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/admin/quizzes`;
  const token = Cookies.get("token") || "";
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data.result);

  const {data: quizzes, error, isLoading} = useSWR(apiUrl, fetcher);

  useEffect(() => {
    setAllQuizzes(quizzes);
  }, [quizzes]);

  const showViewModal = (record) => {
    setSelectedQuiz(record);
    console.log(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Topic",
      key: "topic",
      dataIndex: "topic",
      render: (text) => <a style={{color: "black"}}>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showViewModal(record)}>View</a>
        </Space>
      ),
    },
  ];

  if (error) return navigate("/");
  if (isLoading) return "Loading...";

  return (
    <>
      <Modal
        title="Quiz Details"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedQuiz && (
          <>
            <p>Name: {selectedQuiz.username}</p>
            <p>Topic: {selectedQuiz.topic}</p>
            Content:
            <Markdown remarkPlugins={[remarkGfm]}>
              {selectedQuiz.content}
            </Markdown>
          </>
        )}
      </Modal>
      <Table columns={columns} dataSource={allQuizzes} />
    </>
  );
};

export default QuizList;
