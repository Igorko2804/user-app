import * as React from "react";
import Button from "@mui/material/Button";
import axios from "axios";
export default function UserDelete({ id }) {
  return (
    <Button
      variant="outlined"
      id="delete-button"
      color="error"
      onClick={() => {
        const headers = {
          "Content-Type": "application/json",
          Authorization: process.env.REACT_APP_SECRET_KEY,
        };

        axios
          .delete(
            `${process.env.REACT_APP_API_DOMAIN_NAME}public/v1/users/${id}`,
            {
              headers: headers,
            }
          )
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
