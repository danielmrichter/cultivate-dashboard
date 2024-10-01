import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Box,
  TextField,
  Paper,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accessLevel, setAccessLevel] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleRadio = (event) => setAccessLevel(event.target.value);

  const phoneFormat = (phoneString) => {
    if (phoneString) {
      const newPhoneFormat = phoneString.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "($1)-$2-$3"
      );
      return newPhoneFormat;
    } else {
      return "";
    }
  };
  
  const registerUser = (event) => {
    event.preventDefault();
    const userToAdd = {
      username: username,
      password: password,
      access_level: accessLevel,
      email: email,
      cell_phone: phone,
      first_name: firstName,
      last_name: lastName,
    };

    dispatch({
      type: "REGISTER",
      payload: userToAdd,
    });
  }; // end registerUser

  return (
    <Paper
      sx={{
        width: "80%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <form className="formPanel" onSubmit={registerUser}>
        <h2>Register</h2>
        {errors.loginMessage && (
          <h3 className="alert" role="alert">
            {errors.loginMessage}
          </h3>
        )}
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          size="small"
          sx={{ marginY: "10px", width: "100%" }}
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <FormControl
          sx={{ marginY: "10px", width: "100%" }}
          variant="outlined"
          size="small"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          size="small"
          sx={{ marginY: "10px", width: "100%" }}
          name="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
        id="outlined-basic"
        label="Cell Phone"
        variant="outlined"
        size="small"
        value={phoneFormat(phone)}
        sx={{ marginY: "10px", width: "100%" }}
          name="phone"
          onChange={(event) => setPhone(event.target.value)}
        />
        <Box
          gap={1} // gap of 10px
          display="flex"
          width="100%"
          sx={{ marginY: "10px" }}
        >
          <TextField
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            size="small"
            sx={{ width: "50%" }} // each field takes 50% of the width
            name="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
          <TextField
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            size="small"
            sx={{ width: "50%" }} // each field takes 50% of the width
            name="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </Box>
        <FormControl
          sx={{ width: "100%", display: "flex", alignItems: "center" }}
        >
          <FormLabel id="access-level-radio-group-label">
            Access Level
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="access-level-radio-group"
            name="access-levels"
            defaultValue={accessLevel}
            onChange={(event) => setAccessLevel(event.target.value)}
          >
            <FormControlLabel
              value={1}
              control={<Radio />}
              label="Site Manager"
            />
            <FormControlLabel
              value={2}
              control={<Radio />}
              label="General Manager"
            />
          </RadioGroup>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          sx={{ borderRadius: "30px", paddingX: "40px", width: "126px" }}
          name="submit"
        >
          Register{" "}
        </Button>
      </form>
    </Paper>
  );
}

export default RegisterForm;
