/**
 * Authentication page with login + self-service registration.
 * Authenticates via JWT and keeps UX consistent with the rest of the app.
 */
import React, { useContext, useEffect, useMemo, useState } from "react";
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
  ButtonGroup,
  Collapse,
} from "@mui/material";
import axiosInstance from "@/api/axiosInstance";
import { AuthContext } from "@/context/AuthContext";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useSnackbarContext } from "@/context/SnackbarContext";

type AuthMode = "login" | "register";

type AuthFormValues = {
  username: string;
  password: string;
  confirmPassword?: string;
};

type LocationState = {
  fromLogout?: boolean;
  authMode?: AuthMode;
} | null;

const HomePage: React.FC = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { showSnackbar } = useSnackbarContext();

  const [serverError, setServerError] = useState<string>("");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    const state = location.state as LocationState;

    if (state?.authMode === "register") {
      setMode("register");
    }

    if (state?.authMode || state?.fromLogout) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    reset,
  } = useForm<AuthFormValues>({
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");

  const formTitle = useMemo(
    () => (mode === "login" ? "Log In" : "Create Account"),
    [mode]
  );

  const primaryActionLabel = useMemo(
    () =>
      isSubmitting
        ? mode === "login"
          ? "Logging in..."
          : "Creating account..."
        : formTitle,
    [isSubmitting, mode, formTitle]
  );

  const toggleMode = (nextMode: AuthMode) => {
    if (nextMode !== mode) {
      setMode(nextMode);
      setServerError("");
    }
  };

  const attemptLogin = async (username: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", { username, password });
    const token = response.data?.data?.token;

    if (!token) {
      throw new Error("No token returned by the server.");
    }

    login(token);
    showSnackbar("You logged in successfully", "success");
    navigate("/dashboard", { replace: true });
  };

  const onSubmit = async (values: AuthFormValues) => {
    setServerError("");

    try {
      const username = values.username.trim();
      const password = values.password;

      if (mode === "register") {
        await axiosInstance.post("/auth/register", { username, password });
        showSnackbar("Your account was created successfully. Please log in.", "success");
        setMode("login");
        reset({ username: "", password: "", confirmPassword: "" });
        return;
      }

      await attemptLogin(username, password);
    } catch (err: unknown) {
      const error = err as ApiError;
      const status = error.response?.status;

      if (!error.response) {
        setServerError("Cannot reach the server.");
      } else if (mode === "login" && status === 401) {
        setServerError("Invalid username or password.");
      } else if (mode === "register" && status === 409) {
        setServerError("Username is already taken.");
        setError("username", { type: "manual", message: "Username already in use" });
      } else {
        const fallback = mode === "login" ? "Login failed. Please try again." : "Registration failed. Please try again.";
        setServerError(getErrorMessage(error, fallback));
      }

      setTimeout(() => setServerError(""), 5000);
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
              Welcome Back!
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

        <ConfirmDialog
          open={logoutConfirm}
          title="Logout"
          message="Are you sure you want to logout?"
          onConfirm={() => {
            setLogoutConfirm(false);
            logout();
            showSnackbar("You are logged out successfully", "success");
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

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        px: { xs: 2, sm: 4 },
        gap: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {serverError && (
        <Box sx={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <Fade in={!!serverError} timeout={{ enter: 400, exit: 500 }}>
            <Alert
              severity="error"
              sx={{
                width: "100%",
                maxWidth: 520,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)",
              }}
            >
              {serverError}
            </Alert>
          </Fade>
        </Box>
      )}

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          width: "100%",
          minHeight: { xs: "auto", md: "100%" },
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              width: { xs: "100%", sm: 420 },
              mx: "auto",
              p: { xs: 3, sm: 4 },
              borderRadius: 5,
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(18px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 30px 140px rgba(8,16,12,0.7)",
            }}
          >
            <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  textAlign: "center",
                  color: "#d6f5e1",
                  letterSpacing: "0.5px",
                }}
              >
                {formTitle}
              </Typography>

              <ButtonGroup fullWidth variant="outlined" color="primary">
                <Button
                  variant={mode === "login" ? "contained" : "outlined"}
                  onClick={() => toggleMode("login")}
                >
                  Log In
                </Button>
                <Button
                  variant={mode === "register" ? "contained" : "outlined"}
                  onClick={() => toggleMode("register")}
                >
                  Create Account
                </Button>
              </ButtonGroup>
            </Stack>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={3}>
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
                    autoComplete="off"
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

                <Collapse in={mode === "register"} timeout={280} unmountOnExit mountOnEnter>
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: "#e9f7ef" }}>
                      Confirm Password
                    </Typography>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      aria-label="Confirm Password"
                      {...register("confirmPassword", {
                        validate: (value) => {
                          if (mode === "login") return true;
                          if (!value) {
                            return "Confirm your password";
                          }
                          return value === passwordValue || "Passwords do not match";
                        },
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message || " "}
                      FormHelperTextProps={{ sx: { minHeight: "22px" } }}
                      autoComplete="off"
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
                </Collapse>

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
                  {primaryActionLabel}
                </Button>

                {mode === "login" && (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Need an account?{" "}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => toggleMode("register")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#8fb296",
                      }}
                    >
                      Create one here
                    </Button>
                  </Typography>
                )}

                {mode === "register" && (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Already have an account?{" "}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => toggleMode("login")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#8fb296",
                      }}
                    >
                      Log in here
                    </Button>
                  </Typography>
                )}
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default HomePage;
