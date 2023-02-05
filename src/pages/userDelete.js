import * as React from "react";
import Button from "@mui/material/Button";
import axios from "axios";

export default function UserDelete({ id }) {
  return (
    <Button
      variant="outlined"
      id="delete-button"
      autoFocus
      color="error"
      onClick={() => {
        const headers = {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 99507d5bb8c415f9b0c928fd1b6f5d9a1a1353a33ff5341d392a23bf6e9e4dbe",
        };

        axios
          .delete(`https://gorest.co.in/public/v1/users/${id}`, {
            headers: headers,
          })
          .then(
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          )
          .catch((err) => {
            console.log(err.message);
          });
      }}
    >
      Delete
    </Button>
  );
}
