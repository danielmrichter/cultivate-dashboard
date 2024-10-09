import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <LoginForm />
      <Button
          type="=button"
          variant="outlined"
          sx={{ marginY: '15px', width: '126px', borderRadius: "30px", paddingX: "40px" }}
          onClick={() => {
            navigate('/registration');
          }}
        >
          Register
        </Button>
    </Box>
  );
}

export default LoginPage;
