import React from "react";
import { Container, Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Container sx={{ flexGrow: 1, mt: 2, mb: 2 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
