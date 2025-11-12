import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header: React.FC = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Project Manager
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Αρχική</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>

          {!token ? (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
