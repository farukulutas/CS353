import React, { useEffect, useState } from "react";
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
import Button from "@mui/material/Button";
import AddWorkshopDialog from "../components/AddWorkshopDialog";

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [userType, setUserType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const fetchWorkshops = () => {
    axiosInstance
      .get("/workshop/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setWorkshops(response.data);
      })
      .catch((error) => console.error("Error fetching workshops:", error));
  };

  useEffect(() => {
    fetchWorkshops();

    axiosInstance
      .post(
        "/user/me",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        setUserType(response.data.data.userType);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    fetchWorkshops();
  };

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
          item
          xs={12}
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
            Workshops
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
              placeholder="Search Workshops"
              inputProps={{ "aria-label": "Search workshops" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
              {userType === "ARTIST" && (
                <Button
                  variant="contained"
                  onClick={handleDialogOpen}
                  sx={{ marginLeft: 2 }}
                >
                  Add Workshop
                </Button>
              )}

              <AddWorkshopDialog
                open={openDialog}
                onClose={handleDialogClose}
                onWorkshopAdded={fetchWorkshops}
              />
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
          {workshops.map((workshop, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: 400, width: 300, height: 300 }}>
                <CardActionArea>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "150px",
                    }}
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      {workshop.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workshop.workshopDescription}
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
