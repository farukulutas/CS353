import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import BeAnArtistDialog from './BeAnArtistDialog';
import BeAGalleryOwnerDialog from "./BeAGalleryOwnerDialog";

const pages = [
  "Home",
  "Portfolio",
  "Notifications",
  "Workshops",
  "Collections",
];
const settings = ["Logout"];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isArtistDialogOpen, setIsArtistDialogOpen] = useState(false);
  const [isGalleryOwnerDialogOpen, setIsGalleryOwnerDialogOpen] = useState(false);

  const paths = [
    "/home",
    "/portfolio",
    "/notifications",
    "/workshops",
    "/collections",
  ];

  const handleCloseArtistDialog = () => {
    setIsArtistDialogOpen(false);
  };

  const handleCloseGalleryOwnerDialog = () => {
    setIsGalleryOwnerDialogOpen(false);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <><AppBar
      position="static"
      sx={{ backgroundColor: "#431075", height: "7vh" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
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

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={{ pathname: paths[index] }}
                >
                  <Typography
                    textAlign="center"
                    sx={{ fontFamily: "Apple Color Emoji" }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Apple Color Emoji",
              fontWeight: 700,
              letterSpacing: ".5rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ARTION
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  fontFamily: "Apple Color Emoji",
                  fontWeight: 200,
                }}
                component={Link}
                to={{ pathname: paths[index] }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography
                    textAlign="center"
                    sx={{ fontFamily: "Apple Color Emoji" }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', marginLeft: 'auto', marginBottom: '10px' }}>
            <BeAnArtistDialog open={isArtistDialogOpen} onClose={handleCloseArtistDialog} />
            <BeAGalleryOwnerDialog open={isArtistDialogOpen} onClose={handleCloseGalleryOwnerDialog} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar></>
  );
}
export default Header;
