import {
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInterceptor";
import { useNavigate } from "react-router-dom";

export default function CollectionDetail() {
  const navigate = useNavigate();
  const [collection, setCollection] = useState([]);
  const [collectionTitle, setCollectionTitle] = useState("");
  const collectionId =
    window.location.pathname.split("/").length >= 3
      ? window.location.pathname.split("/")[2]
      : null;

  useEffect(() => {
    axiosInstance
      .get(`/collection/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setCollection(response.data.data);
        setCollectionTitle(response.data.data.collection.collectionName);
      })
      .catch((error) => console.error("Error:", error));
  }, [collectionId]);

  return (
    <>
      <Header />
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          p: 2,
          paddingTop: "2vh",
          width: "100vw",
          height: "93vh",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            gap: "2vh",
            paddingTop: "2vh",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Segoe UI",
              fontWeight: 200,
              fontSize: 36,
              marginTop: "2vh",
            }}
          >
            {collectionTitle || "Collection Loading..."}
          </Typography>
        </Grid>

        <Grid
          container
          spacing={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            width: "100vw",
          }}
        >
          {(collection.artworkDtos || []).map((col) => (
            <Grid
              item
              key={col.artworkDto.artworkId}
              onClick={() =>
                navigate(`/artwork-detail/${col.artworkDto.artworkId}`)
              }
            >
              <Card sx={{ maxWidth: 400, width: 300 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="400"
                    image={`data:image/jpeg;base64,${col.displayImage}`}
                    alt="artwork"
                  />
                  <CardContent
                    sx={{
                      height: "35px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography
                      gutterBottom
                      fontSize={"24"}
                      fontWeight={700}
                      fontFamily={"Segoe UI"}
                      component="div"
                    >
                      {col.artworkDto.artworkName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {col.artworkDto.artistName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
