import { useEffect } from "react";
import { useState } from "react";

import { ButtonGroup, Stack } from "@mui/material";
import MaterialTable from "@material-table/core";
import EditForm from "./editForm";
import UserDelete from "./userDelete";
import axios from "axios";

const columns = [
  { title: "Id", field: "id" },
  { title: "Name", field: "name" },
  { title: "Email", field: "email" },
  { title: "Gender", field: "gender" },
  { title: "Status", field: "status" },
  { title: "Actions", field: "actions" },
];
const Index = ({}) => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 99507d5bb8c415f9b0c928fd1b6f5d9a1a1353a33ff5341d392a23bf6e9e4dbe",
    };
    axios
      .get("https://gorest.co.in/public/v1/users", { headers: headers })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const users = data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    status: user.status,
    actions: (
      <ButtonGroup variant="text" size="small" aria-label="small button group">
        <EditForm
          id={user.id}
          name={user.name}
          email={user.email}
          gender={user.gender}
          status={user.status}
        />
        <UserDelete id={user.id} />
      </ButtonGroup>
    ),
  }));

  return (
    <Stack>
      <MaterialTable
        title=""
        columns={columns}
        data={users}
        options={{ grouping: true }}
      />
    </Stack>
  );
};

export default Index;
