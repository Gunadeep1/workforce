import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import DomainCheck from '../signUp/DomainCheck';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Work Force 
          </Typography>
          <Button color="inherit" onClick={() => { navigate("/signup") }}>SignUp</Button>
          <Button color="inherit" onClick={() => { setOpen(true) }}>SignIn</Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Typography>
          Landing page coming soon.........
         </Typography>
      </Box>
      <DomainCheck open={open} setOpen={setOpen} />
    </Box>
  );
}
