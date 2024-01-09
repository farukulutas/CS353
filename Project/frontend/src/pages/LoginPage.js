import React, { useState, useContext } from "react";
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
import axiosInstance, { setAuthToken } from "../service/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { setUser } = useContext(UserContext);

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (data) => {
    setEmailError(!data.get("email"));
    setPasswordError(!data.get("password"));
    return data.get("email") && data.get("password");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!validateForm(data)) return;
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    if (!data.get("email") || !data.get("password")) {
      throw new Error("Text fields are blank!");
    }

    try {
      const res = await axiosInstance.post("/auth/login", {
        creds: data.get("email"),
        password: data.get("password"),
      });

      console.log("res", res);

      const accessToken = res.data?.data?.jwtToken;
      console.log("accesstoken", accessToken);
      if (!accessToken) throw new Error("accessToken is not available.");

      localStorage.setItem("accessToken", accessToken);
      setAuthToken(accessToken);
      const userId = res.data?.data?.user_id;
      if (!userId) throw new Error("userId is not available.");
      const userData = { artistId: userId };
      setUser(userData);
      navigate("/home");
    } catch (err) {
      console.log("err", err);
      throw new Error("Cannot login!");
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
          Login
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
            error={emailError}
            helperText={emailError ? "Email is required" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            error={passwordError}
            helperText={passwordError ? "Password is required" : ""}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
