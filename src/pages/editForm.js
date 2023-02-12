import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import humanizeString from "humanize-string";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditForm({ id, name, email, gender, status }) {
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [severity, setSeverity] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [gender_value, setGenderValue] = useState("");
  const [status_value, setStatusValue] = useState("");
  const selectGender = (e) => setGenderValue(e.target.value);
  const selectStatus = (e) => setStatusValue(e.target.value);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              User
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                const headers = {
                  "Content-Type": "application/json",
                  Authorization: process.env.REACT_APP_SECRET_KEY,
                };
                let data = JSON.stringify({
                  name: document.getElementById("name").value,
                  email: document.getElementById("email").value,
                  gender: gender_value,
                  status: status_value,
                });

                axios
                  .put(
                    `${process.env.REACT_APP_API_DOMAIN_NAME}public/v1/users/${id}`,
                    data,
                    { headers: headers }
                  )
                  .then((response) => {
                    setAlert(true);
                    setSeverity("success");
                    setAlertContent("User updated");
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  })
                  .catch((error) => {
                    if (error.response.status == "422") {
                      let messages = [];
                      error.response.data.data.map((row) => {
                        messages.push(
                          <li>
                            {humanizeString(row.field)} {row.message}
                          </li>
                        );
                      });
                      setAlert(true);
                      setSeverity("error");
                      setAlertContent(<ul>{messages}</ul>);
                    } else {
                      setAlertContent(`Something went wrong: ${error}`);
                    }
                  });
              }}
            >
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          defaultValue={name}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          defaultValue={email}
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select onChange={selectStatus} defaultValue={status}>
            <MenuItem value={"active"}>Active</MenuItem>
            <MenuItem value={"inactive"}>Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="gender">Gender</InputLabel>
          <Select onChange={selectGender} defaultValue={gender}>
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
          </Select>
        </FormControl>
        {alert ? <Alert severity={severity}>{alertContent}</Alert> : <></>}
      </Dialog>
    </div>
  );
}
