import {useEffect, useState} from "react";
import {Table, Space, Button, Modal, Tag} from "antd";
import axios from "axios";
import useSWR from "swr";
import Cookies from "js-cookie";

const UserList = () => {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/users/get`;
  const token = Cookies.get("token") || "";
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showViewModal = (record) => {
    setSelectedUser(record);
    console.log(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "Status",
      key: "tags",
      dataIndex: "tags",
      render: (_, {status}) => {
        let color = status === "active" ? "success" : "default";
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showViewModal(record)}>View</a>
          <a>Edit</a>
        </Space>
      ),
    },
  ];

  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data.result);

  const {
    data: users,
    error,
    isLoading,
  } = useSWR(apiUrl, fetcher, {refreshInterval: 3000});

  const userTableView = users?.map((user) => ({
    key: user.studentId,
    id: `${user.degreeCode}${user.studentId}`,
    name: `${user.firstName} ${user.lastName}`,
    type: user.type,
    [user.type === "professor" ? "Description" : "Degree"]: user.degreeName,
    status: user.status,
    email: user.email,
    phone: `+${user.countryCode} ${user.phone}`,
    gender: user.gender,
    dateUpdated: user.dateUpdated,
    dateCreated: user.dateCreated,
  }));

  console.log("users", userTableView);

  useEffect(() => {
    setUserList(userTableView);
  }, [users]);

  if (error) return error;
  if (isLoading) return "Loading...";

  const excludeProps = ["type", "key"];

  return (
    <div>
      <Modal
        title="User Details"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedUser && (
          <>
            {selectedUser && (
              <>
                {Object.entries(selectedUser).map(([key, value]) =>
                  // Skip properties in the excludeProps array
                  excludeProps.includes(key) ? null : (
                    <p key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </p>
                  )
                )}
              </>
            )}
          </>
        )}
      </Modal>
      <Table columns={columns} dataSource={userTableView} />
    </div>
  );
};

export default UserList;
