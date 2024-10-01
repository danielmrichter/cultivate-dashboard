import React from 'react';
import { Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';

function RegisterPage() {
  const history = useHistory();

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <RegisterForm />
      <Button
          type="=button"
          variant="outlined"
          sx={{ marginY: '15px', width: '126px', borderRadius: "30px", paddingX: "40px" }}
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </Button>
    </Box>
  );
}

export default RegisterPage;
