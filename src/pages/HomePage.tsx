import React from "react";
import { Typography, Box } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h4" gutterBottom>
        Καλώς ήρθες στο Project Manager
      </Typography>
      <Typography>
        Εδώ μπορείς να διαχειριστείς τα projects σου εύκολα και οργανωμένα.
      </Typography>
    </Box>
  );
};

export default HomePage;
