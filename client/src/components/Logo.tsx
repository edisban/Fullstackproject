import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface LogoProps {
  /** Hide the word mark (icon only). */
  compact?: boolean;
  inverted?: boolean;
}

const LogoMark = ({ size = 32 }: { size?: number }) => (
  <Box
    component="svg"
    viewBox="0 0 32 32"
    aria-hidden
    sx={{ width: size, height: size, flexShrink: 0, display: "block" }}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#14b8a6" />
        <stop offset="1" stopColor="#0f766e" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
    <rect x="7" y="8" width="8" height="8" rx="2" fill="#fff" />
    <rect x="17" y="8" width="8" height="8" rx="2" fill="#fff" opacity=".6" />
    <rect x="7" y="18" width="8" height="6" rx="2" fill="#fff" opacity=".6" />
    <rect x="17" y="18" width="8" height="6" rx="2" fill="#fff" />
  </Box>
);

export const Logo = ({ compact = false, inverted = false }: LogoProps) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
    <LogoMark />
    {!compact && (
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: "1.05rem",
          letterSpacing: "-0.02em",
          color: inverted ? "#fff" : "text.primary",
        }}
      >
        Project Manager
      </Typography>
    )}
  </Box>
);
