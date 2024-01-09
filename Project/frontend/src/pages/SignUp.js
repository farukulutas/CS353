import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axiosInstance from "../service/axiosInterceptor";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = (data) => {
    const errors = {
      email: !data.get("email"),
      password: !data.get("password"),
      confirmPassword: data.get("password") !== data.get("confirmPassword"),
    };
    setFormErrors(errors);
    return !errors.email && !errors.password && !errors.confirmPassword;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!validateForm(data)) return;
    console.log({
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    });

    try {
      const res = await axiosInstance.post("/auth/register", {
        username: data.get("username"),
        email: data.get("email"),
        password: data.get("password"),
      });
      navigate("/");
      console.log("res", res);
    } catch (err) {
      console.log("err", err);
      throw new Error("Cannot register!");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            fontSize: "48px",
            display: { xs: "none", md: "flex" },
            fontFamily: "Apple Color Emoji",
            fontWeight: 200,
            letterSpacing: ".5rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          ARTION
        </Typography>
        <Typography
          sx={{
            mr: 2,
            fontSize: "24px",
            display: { xs: "none", md: "flex" },
            fontFamily: "Apple Color Emoji",
            fontWeight: 200,
          }}
          component="h1"
          variant="h5"
        >
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={formErrors.email}
            helperText={formErrors.email ? "Email is required" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            error={formErrors.username}
            helperText={formErrors.username ? "Username is required" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="new-password"
            error={formErrors.password}
            helperText={formErrors.password ? "Password is required" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            autoComplete="new-password"
            error={formErrors.confirmPassword}
            helperText={
              formErrors.confirmPassword ? "Passwords do not match" : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleToggleShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
