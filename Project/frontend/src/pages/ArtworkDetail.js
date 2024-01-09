import { Grid, Typography, Paper, TextField, Button } from "@mui/material";
import Header from "../components/Header";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInterceptor";

export default function ArtworkDetail() {
  const [artwork, setArtwork] = useState([]);
  const [artworkTitle, setArtworkTitle] = useState("");
  const [artworkArtist, setArtworkArtist] = useState("");
  const [artworkDesc, setArtworkDesc] = useState("");
  const artworkId =
    window.location.pathname.split("/").length >= 3
      ? window.location.pathname.split("/")[2]
      : null;
  const [collections, setCollections] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [auctionId, setAuctionId] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const handleBidChange = (event) => {
    setBidAmount(event.target.value);
  };
  
  useEffect(() => {
    if (artworkId) {
      axiosInstance.get(`auction/artwork/${artworkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(response => {
        const auctionData = response.data.data;
        if (auctionData && auctionData.auction) {
          setAuctionId(auctionData.auction.auctionId);
        }
      })
      .catch(error => console.error("Error fetching auction data:", error));
    }
  }, [artworkId]);

  const handleSubmitBid = () => {
    if (!auctionId || !bidAmount) {
      console.error("Auction ID or Bid Amount is missing");
      return;
    }
  
    const bidData = JSON.stringify({ amount: bidAmount });
    axiosInstance.post(`/bid/${auctionId}`, bidData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      console.log('Bid submitted successfully', response);
    })
    .catch(error => {
      console.error('Error submitting bid:', error);
    });
  };    

  useEffect(() => {
    const userId = 3; // TODO:
    axiosInstance.get(`/collection/creator/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(response => {
      setCollections(response.data.data.collections);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  const handleAddToCollection = (collectionId) => {
    axiosInstance.put(`/collection/${collectionId}`, {
      artworks: [artworkId]
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(response => {
      setIsDialogOpen(false);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    axiosInstance
      .get(`/art/details/${artworkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setArtwork(response.data.data);
        setArtworkTitle(response.data.data.artworkDto.artworkName);
        setArtworkArtist(response.data.data.artworkDto.artistName);
        setArtworkDesc(response.data.data.artworkDto.artworkDescription);
        console.log("artwork", response.data.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [artworkId]);

  return (
    <>
      <Header />
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 10,
          p: 2,
          paddingTop: 10,
          width: "100vw",
          height: "93vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Grid
          component={Paper}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            width: "40%",
            height: "70%",
          }}
        >
          <img
            width={"90%"}
            height={"90%"}
            src={`data:image/jpeg;base64,${artwork.displayImage}`}
            alt={"ojkeg"}
          />
        </Grid>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 3,
            p: 4,
            width: "50%",
            minHeight: "70%",
          }}
          component={Paper}
        >
          <Button sx={{ backgroundColor: "#246d82" }} variant="contained" onClick={handleOpenDialog}>
        Add to Collection
      </Button>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add Artwork to Collection</DialogTitle>
        <DialogContent>
          <List>
            {collections.map(collection => (
              <ListItem 
                button 
                key={collection.artGalleryId} 
                onClick={() => handleAddToCollection(collection.artGalleryId)}
              >
                <ListItemText primary={collection.artGalleryName} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
          <Typography
            sx={{ fontFamily: "Segou UI", fontSize: "42px", fontWeight: "600" }}
          >
            {artworkTitle || "Artwork Loading..."}
          </Typography>
          <Typography sx={{ fontFamily: "Segou UI", fontSize: "32px" }}>
            {artworkArtist || "Artist Loading..."}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Segou UI",
              fontSize: "20px",
              color: "#B3B3B3",
              textAlign: "start",
            }}
          >
            {artworkDesc || "Description Loading..."}
          </Typography>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              p: 2,
              width: "90%",
              height: "10%",
              alignSelf: "center",
              marginTop: "40px",
              boxShadow: 3,
            }}
          >
            <TextField
              id="outlined-multiline-static"
              label="Bid"
              placeholder="Enter bid!"
              sx={{ width: "50%" }}
              value={bidAmount}
              onChange={handleBidChange}
            />
            <Button 
              sx={{ backgroundColor: "#246d82" }} 
              variant="contained" 
              onClick={handleSubmitBid}
              disabled={!auctionId}
            >
              Submit Bid
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
