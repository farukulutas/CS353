import {
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  InputBase,
  TextField,
} from "@mui/material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInterceptor";

export default function Home() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    artistName: "",
    fixedPrice: "",
    sizeX: "",
    sizeY: "",
    sizeZ: "",
    artworkLocation: "",
    artworkDescription: "",
  });

  useEffect(() => {
    axiosInstance
      .get(`/art/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setArtworks(response.data.data.artworkDtos);
        console.log("artworks", response.data.data.artworkDtos);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = (artwork) => {
    return Object.entries(filters).every(([key, value]) => {
      return value ? artwork.artworkDto[key] && artwork.artworkDto[key].toString().toLowerCase().includes(value.toLowerCase()) : true;
    });
  };

  const filteredArtworks = artworks.filter(artwork =>
    artwork.artworkDto.artworkName.toLowerCase().includes(searchTerm) && applyFilters(artwork)
  );

  return (
  <>
    <Header />
    <Grid container sx={{ width: '100%', padding: 2 }}>
      
      {/* Search and Filter Section */}
      <Grid item xs={12} sx={{ marginBottom: 4 }}>
        <Typography variant="h4"         sx={{
          fontFamily: "Segoe UI",
          fontWeight: 200,
          fontSize: 36,
          marginTop: "2vh",
          marginBottom: "2vh",
        }}>Explore and Embrace Art in Artion</Typography>
        
        {/* First Row of Filters */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InputBase
              sx={{ width: '100%', border: '1px solid #ddd', padding: '5px 10px', borderRadius: 2 }}
              placeholder="Search Artworks"
              inputProps={{ 'aria-label': 'Search artworks' }}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={4}>
            <TextField
              label="Artist Name"
              name="artistName"
              onChange={handleFilterChange} 
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3} md={4}>
            <TextField
              label="Fixed Price"
              name="fixedPrice"
              onChange={handleFilterChange}
              type="number"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          
        </Grid>

        {/* Second Row of Filters */}
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Size X"
              name="sizeX"
              onChange={handleFilterChange}
              type="number"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Size Y"
              name="sizeY"
              onChange={handleFilterChange}
              type="number"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Size Z"
              name="sizeZ"
              onChange={handleFilterChange}
              type="number"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Artwork Location"
              name="artworkLocation"
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Artwork Description"
              name="artworkDescription"
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
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
          {filteredArtworks.map((artwork) => (
            <Grid
              key={artwork.artworkDto.artworkId}
              item
              onClick={() =>
                navigate(`/artwork-detail/${artwork.artworkDto.artworkId}`)
              }
            >
              <Card sx={{ maxWidth: 400, width: 300 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`data:image/jpeg;base64,${artwork.displayImage}`}
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
                      {artwork.artworkDto.artworkName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {artwork.artworkDto.artistName}
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
