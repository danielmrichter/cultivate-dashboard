import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Paper,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const errors = useAppSelector((store) => store.errors);
  const dispatch = useAppDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: "LOGIN",
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  }; // end login

  return (
    <Paper
      sx={{
        width: '80%',
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: 'center',
        padding: "20px",
      }}
    >
      <form className="formPanel" onSubmit={login}>
        <h2>Login</h2>
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
        <Button
          type="submit"
          variant="contained"
          sx={{ borderRadius: "30px", paddingX: "40px" }}
          name="submit"
        >
          Log In
        </Button>
      </form>
    </Paper>
  );
}

export default LoginForm;
