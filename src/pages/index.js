import { ButtonGroup, Stack } from "@mui/material";
import MaterialTable from "@material-table/core";
import EditForm from "./editForm";
import UserDelete from "./userDelete";
import axios from "axios";
import React from "react";

const columns = [
  { title: "Id", field: "id" },
  { title: "Name", field: "name" },
  { title: "Email", field: "email" },
  {
    title: "Gender",
    field: "gender",
    lookup: { male: "Male", female: "Female" },
  },
  {
    title: "Status",
    field: "status",
    lookup: { active: "Active", inactive: "Inactive" },
  },
  { title: "Actions", field: "actions", filtering: false },
];
const Index = () => {
  function fetchData(resolve, query) {
    let url = `${process.env.REACT_APP_API_DOMAIN_NAME}public/v1/users?`;
    let headers = {
      "Content-Type": "application/json",
      Authorization: process.env.REACT_APP_SECRET_KEY,
    };

    if (query.filters.length > 0) {
      query.filters.map((filter) => {
        url += `${filter.column.field}=${filter.value}&`;
      });
    }

    url += "&per_page=" + query.pageSize;
    url += "&page=" + (query.page + 1);
    axios
      .get(url, { headers: headers })
      .then((response) => response.data)
      .then((result) => {
        resolve({
          data: prepareData(result.data, query),
          page: result.meta.pagination.page - 1,
          totalCount: result.meta.pagination.total,
        });
      });
  }

  function prepareData(data, query) {
    let users = data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
      actions: (
        <ButtonGroup
          variant="text"
          size="small"
          aria-label="small button group"
        >
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

    if (query.orderBy == undefined) {
      return users;
    } else {
      return query.orderDirection == "asc"
        ? sortAscByKey(users, query.orderBy.field)
        : sortDescByKey(users, query.orderBy.field);
    }
  }

  function sortAscByKey(array, key) {
    return array.sort(function (a, b) {
      let x = a[key];
      let y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  }

  function sortDescByKey(array, key) {
    return array.sort(function (a, b) {
      let x = a[key];
      let y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  return (
    <Stack>
      <MaterialTable
        title="Users table"
        columns={columns}
        data={(query) =>
          new Promise((resolve, _) => {
            fetchData(resolve, query);
          })
        }
        options={{
          sorting: true,
          filtering: true,
          search: false,
          grouping: true,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
      />
    </Stack>
  );
};

export default Index;
