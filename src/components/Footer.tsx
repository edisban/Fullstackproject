import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: "auto",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Project Manager — All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
