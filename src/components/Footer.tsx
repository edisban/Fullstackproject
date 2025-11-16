import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Footer: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: "auto",
        textAlign: "center",
        color: "#ffffff",
        backgroundImage: `linear-gradient(90deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
        borderTop: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Typography variant="body2" color="inherit">
        © {new Date().getFullYear()} Project Manager — All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
