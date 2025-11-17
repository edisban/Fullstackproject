import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const Header: React.FC = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDrawerOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            Project Manager
          </Typography>
          {token && user?.username && (
            <Typography
              variant="caption"
              color="inherit"
              sx={{ opacity: 0.8, display: { xs: "none", sm: "block" } }}
            >
              Signed in as {user.username}
            </Typography>
          )}
        </Box>

        {isMobile ? (
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setDrawerOpen(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
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
        )}
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1 }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavClick(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => (token ? handleLogout() : handleNavClick("/login"))}
              >
                <ListItemText primary={token ? "Logout" : "Login"} />
              </ListItemButton>
            </ListItem>
          </List>
          {token && user?.username && (
            <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: "divider", mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Signed in as {user.username}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
