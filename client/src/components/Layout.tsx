
import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import NotificationSnackbar from "./NotificationSnackbar";
import { useSnackbarContext } from "@/context/SnackbarContext";

const Layout: React.FC = () => {
  const { open, message, severity, handleClose } = useSnackbarContext();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>

      <Footer />

      <NotificationSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </Box>
  );
};

export default Layout;