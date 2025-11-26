/**
 * Login page with JWT authentication.
 * Handles user login, auto-redirects if already authenticated, and displays error/success messages.
 */
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
import ConfirmDialog from "@/components/ConfirmDialog";

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
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // ------------------------- REDIRECT + WARNINGS HANDLING -------------------------
  useEffect(() => {
    const fromLogout = location.state?.fromLogout === true;

    if (fromLogout) {
      setJustLoggedOut(true);
      setShowWarning(false);
      window.history.replaceState({}, document.title);

      const logoutTimer = setTimeout(() => setJustLoggedOut(false), 500);
      return () => clearTimeout(logoutTimer);
    }

    if (justLoggedOut) return;

    const wasRedirectedFromProtected =
      location.state?.from?.pathname === "/dashboard" ||
      location.state?.from?.pathname?.startsWith("/students/");

    if (wasRedirectedFromProtected) {
      window.history.replaceState({}, document.title);
      setShowWarning(true);
      const timer = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowWarning(false);
    }
  }, [location.state, justLoggedOut]);

  // ------------------------------ FORM ------------------------------
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
        setTimeout(() => setServerError(""), 5000);
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

      setTimeout(() => setServerError(""), 5000);
      setShowWarning(false);
    }
  };

  // ------------------------------ IF ALREADY LOGGED IN ------------------------------
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

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button variant="contained" size="large" onClick={() => navigate("/dashboard")} sx={{ px: 4 }}>
                Go to Dashboard →
              </Button>

              <Button variant="outlined" size="large" onClick={() => setLogoutConfirm(true)} sx={{ px: 4 }}>
                Logout
              </Button>
            </Stack>
          </Box>
        </Fade>

        {/* Logout Confirmation */}
        <ConfirmDialog
          open={logoutConfirm}
          title="Logout"
          message="Are you sure you want to logout?"
          onConfirm={() => {
            setLogoutConfirm(false);
            logout();
            setShowWarning(false);
            window.history.replaceState({}, document.title);
            navigate("/", { replace: true, state: { fromLogout: true } });
          }}
          onCancel={() => setLogoutConfirm(false)}
          confirmText="Logout"
          cancelText="Cancel"
          confirmColor="primary"
        />
      </Container>
    );
  }

  // ------------------------------ LOGIN FORM UI ------------------------------
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
      {/* TOP WARNINGS */}
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

      {/* FORM */}
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(18px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.40)",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                mb: 3,
                textAlign: "center",
                color: "#d6f5e1",
                letterSpacing: "0.5px",
              }}
            >
              Log In
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="on">
              <Stack spacing={3}>
                {/* USERNAME */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: "#e9f7ef" }}>
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    id="username"
                    placeholder="Enter your username"
                    aria-label="Username"
                    {...register("username", { required: "Username is required" })}
                    error={!!errors.username}
                    helperText={errors.username?.message || " "}
                    FormHelperTextProps={{ sx: { minHeight: "22px" } }}
                    inputProps={{ autoComplete: "username" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.08)",
                        "& fieldset": { border: "1px solid rgba(255,255,255,0.15)" },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
                        "&.Mui-focused fieldset": { borderColor: "#8fb296" },
                        "& input": { background: "transparent !important", color: "#d9f7e8" },
                      },
                    }}
                  />
                </Box>

                {/* PASSWORD */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: "#e9f7ef" }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    aria-label="Password"
                    {...register("password", { required: "Password is required" })}
                    error={!!errors.password}
                    helperText={errors.password?.message || " "}
                    FormHelperTextProps={{ sx: { minHeight: "22px" } }}
                    inputProps={{ autoComplete: "new-password" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.08)",
                        "& fieldset": { border: "1px solid rgba(255,255,255,0.15)" },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
                        "&.Mui-focused fieldset": { borderColor: "#8fb296" },
                        "& input": { background: "transparent !important", color: "#d9f7e8" },
                      },
                    }}
                  />
                </Box>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    py: 1.75,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
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
