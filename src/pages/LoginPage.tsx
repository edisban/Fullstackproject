import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "@/api/axiosInstance";
import { AuthContext } from "@/context/AuthContext";

type LoginFormValues = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || "/dashboard";
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const buildReadableError = (err: any): string => {
    if (!err) {
      return "Unexpected error. Please try again.";
    }

    const status = err.response?.status;
    if (status === 401) {
      return "Invalid username or password.";
    }

    if (!err.response) {
      return "Cannot reach the server. Is the backend running on port 8080?";
    }

    const payload = err.response?.data;
    if (typeof payload === "string" && payload.trim().length > 0) {
      return payload;
    }

    if (payload?.message) {
      return payload.message;
    }

    if (status && status >= 500) {
      return "Server error while signing in. Please check the backend logs.";
    }

    return "Connection error. Please try again.";
  };

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      const trimmedPayload = {
        username: values.username.trim(),
        password: values.password,
      };
      const response = await axiosInstance.post("/auth/login", trimmedPayload);
      const token: string | undefined = response.data?.token;
      if (!token) {
        setServerError("No token returned by the server.");
        return;
      }
      login(token);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login failed", err);
      setServerError(buildReadableError(err));
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "calc(100vh - 200px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f1f1c",
    padding: "2rem",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#0f1f1c",
    borderRadius: 20,
    boxShadow: "0 25px 45px rgba(2, 10, 10, 0.6)",
    padding: "2.4rem",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#f5fffb",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    marginBottom: "0.35rem",
    color: "#d5f2e8",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 0.95rem",
    borderRadius: 10,
    border: "1px solid #8fb296",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 120ms ease, box-shadow 120ms ease",
    backgroundColor: "#ffffff",
  };

  const errorTextStyle: React.CSSProperties = {
    color: "#d93025",
    fontSize: "0.9rem",
    marginTop: "0.35rem",
  };

  const submitButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem",
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    color: "#ffffff",
    background: "linear-gradient(130deg, #5a8d82, #476e65)",
    boxShadow: "0 12px 24px rgba(139, 181, 171, 0.35)",
    opacity: isSubmitting ? 0.85 : 1,
    transition: "transform 120ms ease, box-shadow 120ms ease",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, color: "#f5fffb", fontSize: "2rem" }}>Login</h2>
          <p style={{ color: "#b6d5cb", marginTop: "0.35rem" }}>
            Sign in to manage your projects and team.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="username" style={labelStyle}>
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              style={inputStyle}
              disabled={isSubmitting}
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
            />
            {errors.username && <div style={errorTextStyle}>{errors.username.message}</div>}
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              style={inputStyle}
              disabled={isSubmitting}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 4, message: "Minimum 4 characters" },
              })}
            />
            {errors.password && <div style={errorTextStyle}>{errors.password.message}</div>}
          </div>

          {serverError && (
            <div
              style={{
                backgroundColor: "rgba(255, 96, 96, 0.15)",
                color: "#ffb4b4",
                borderRadius: 12,
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                fontSize: "0.95rem",
                border: "1px solid rgba(255, 96, 96, 0.3)",
              }}
            >
              {serverError}
            </div>
          )}

          <button type="submit" style={submitButtonStyle} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
