import React, { useContext, useState, useCallback, memo } from "react";
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

const Header: React.FC = memo(() => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = useCallback(() => {
    setDrawerOpen(false);
    
    sessionStorage.setItem("intentionalLogout", "true");
    
    logout();
    
    navigate("/", {
      replace: true,
      state: null,
    });
  }, [navigate, logout]);

  const handleNavClick = useCallback((path: string) => {
    navigate(path);
    setDrawerOpen(false);
  }, [navigate]);

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            color="inherit"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Project Manager
          </Typography>

          {token && user?.username && (
            <Typography
              variant="caption"
              color="inherit"
              sx={{
                opacity: 0.8,
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              Signed in as {user.username}
            </Typography>
          )}
        </Box>

        {isMobile ? (
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerOpen}
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

            {token && (
              <Button color="inherit" onClick={handleLogout }>
                Logout
              </Button>
            )}
          </Box>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            backgroundColor: "#143C36",
            color: "white",
          },
        }}
      >
        <Box sx={{ width: 250, pt: 2 }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1 }}>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon sx={{ color: "white" }} />
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

            {token && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            )}
          </List>

          {token && user?.username && (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderTop: 1,
                borderColor: "rgba(255,255,255,0.2)",
                mt: 2,
              }}
            >
              <Typography variant="caption" color="white">
                Signed in as {user.username}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
});

Header.displayName = "Header";

export default Header;
