import { Grid, Typography, Paper, TextField, Button } from "@mui/material";
import Header from "../components/Header";

export default function Home({
  imageName,
  imagePath,
  imageDescription,
  imageArtist,
  imagePrice,
  imageCategory,
}) {
  return (
    <>
      <Header />
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
          p: 2,
          paddingTop: 10,
          width: "100vw",
          height: "93vh",
        }}
      >
        <Typography sx={{ fontSize: "32px", fontStyle: "bold" }}>
          404 - NOT FOUND :(
        </Typography>
        <Typography
          sx={{ fontFamily: "Segoe UI", fontSize: "48px", fontStyle: "italic" }}
        >
          Let the art guide you back home.
        </Typography>
        <img width={700} src="/artworks/bilkent.jpeg" alt="bilkent" />
      </Grid>
    </>
  );
}
