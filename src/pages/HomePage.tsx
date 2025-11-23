import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getErrorMessage, type ApiError } from "@/types/errors";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Stack,
  Alert,
  Fade,
} from "@mui/material";
import axiosInstance from "@/api/axiosInstance";
import { AuthContext } from "@/context/AuthContext";

type LoginFormValues = {
  username: string;
  password: string;
};

const HomePage: React.FC = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [serverError, setServerError] = useState<string>("");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const intentionalLogout = sessionStorage.getItem("intentionalLogout") === "true";
    
    if (intentionalLogout) {
      sessionStorage.removeItem("intentionalLogout");
      return;
    }

    const wasRedirectedFromProtectedRoute = 
      location.state?.from?.pathname === "/dashboard" ||
      location.state?.from?.pathname?.startsWith("/tasks/");

    if (wasRedirectedFromProtectedRoute && !isAuthenticated) {
      window.history.replaceState({}, document.title);
      setShowWarning(true);
      const timer = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");

    try {
      const response = await axiosInstance.post("/auth/login", {
        username: values.username.trim(),
        password: values.password,
      });

      const token = response.data?.data?.token;

      if (!token) {
        setServerError("No token returned by the server.");
        setTimeout(() => setServerError(""), 4000);
        return;
      }

      login(token);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const error = err as ApiError;
      const status = error.response?.status;

      if (status === 401) {
        setServerError("Invalid username or password.");
      } else if (!error.response) {
        setServerError("Cannot reach the server.");
      } else {
        setServerError(getErrorMessage(error, "Login failed. Please try again."));
      }

      setTimeout(() => setServerError(""), 4000);

      setShowWarning(false);
    }
  };

  if (isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in timeout={600}>
          <Box textAlign="center">
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                background: "linear-gradient(135deg, #5a8d82 0%, #8fb296 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back! 👋
            </Typography>

            <Typography variant="h6" color="text.secondary" mb={4}>
              You're already logged in
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/dashboard")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Go to Dashboard →
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  logout();
                  setShowWarning(false);
                  window.history.replaceState({}, document.title);
                  navigate("/", { replace: true, state: { fromLogout: true } });
                }}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        transform: "scale(0.90)",
        transformOrigin: "top center",
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
        gap: 3,
      }}
    >
      {/* TOP WARNING OR ERROR */}
      <Box sx={{ minHeight: "64px", mb: 2 }}>
        <Fade in={showWarning} timeout={{ enter: 400, exit: 500 }}>
          <Alert
            severity="warning"
            sx={{
              width: "100%",
              maxWidth: 520,
              mx: "auto",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(237, 108, 2, 0.2)",
            }}
          >
            You must login first to access Dashboard.
          </Alert>
        </Fade>

        <Fade in={!!serverError} timeout={{ enter: 400, exit: 500 }}>
          <Alert
            severity="error"
            sx={{
              width: "100%",
              maxWidth: 520,
              mx: "auto",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)",
            }}
          >
            {serverError}
          </Alert>
        </Fade>
      </Box>

      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background:
                "linear-gradient(145deg, rgba(30, 58, 54, 0.8) 0%, rgba(15, 31, 28, 0.9) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(143, 178, 150, 0.2)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
              🔐 Login
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your credentials to access your dashboard
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your username"
                    {...register("username", { required: "Username is required" })}
                    error={!!errors.username}
                    helperText={errors.username?.message || " "}
                    FormHelperTextProps={{ sx: { minHeight: "22px", height: "22px" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "1rem",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message || " "}
                    FormHelperTextProps={{ sx: { minHeight: "22px", height: "22px" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "1rem",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #5a8d82 0%, #476e65 100%)",
                    boxShadow: "0 8px 24px rgba(90, 141, 130, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #476e65 0%, #3a5b54 100%)",
                      boxShadow: "0 12px 32px rgba(90, 141, 130, 0.5)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {isSubmitting ? "Logging in..." : "Login →"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default HomePage;
