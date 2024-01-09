import {
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  InputBase,
} from "@mui/material";
import Header from "../components/Header";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../service/axiosInterceptor";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axiosInstance
      .get("/collection/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        if (
          response.data.data.collections &&
          response.data.data.collections[0] &&
          response.data.data.collections[0].artworkDtos &&
          response.data.data.collections[0].artworkDtos[0]
        ) {
          setCollections(response.data.data.collections);
          console.log("collections", collections);
          console.log(
            "response.data.data.collections",
            response.data.data.collections
          );
        }
      })
      .catch((error) => console.error("Error:", error));
  }, [collections]);

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
            Collections
          </Typography>
          <Grid>
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                backgroundColor: "#F5F5F5",
                p: "5px",
                borderRadius: "5px",
                width: "50vw",
              }}
              placeholder="Search Collections"
              inputProps={{ "aria-label": "Search collections" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Grid>
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
          {collections.map((collection) => (
            <Grid
              key={collection.collection.collectionId}
              item
              onClick={() =>
                navigate(
                  `/collection-detail/${collection.collection.collectionId}`
                )
              }
            >
              <Card sx={{ maxWidth: 400, width: 300 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`data:image/jpeg;base64,${collection.artworkDtos[0].displayImage}`}
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
                      {collection.collection.collectionName}
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
