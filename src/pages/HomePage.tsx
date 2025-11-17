import React from "react";
import { Typography, Box } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <Box textAlign="center" mt={5} px={{ xs: 2, sm: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>
        Welcome to Project Manager
      </Typography>
      <Typography variant="body1" sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>
        Manage all of your projects in one organized place.
      </Typography>
    </Box>
  );
};

export default HomePage;
