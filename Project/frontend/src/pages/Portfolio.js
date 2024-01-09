import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Header from "../components/Header";
import axiosInstance from "../service/axiosInterceptor";

export default function Portfolio() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [bids, setBids] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/art/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => setArtworks(response.data.data.artworkDtos))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    console.log("Selected Artwork Updated: ", selectedArtwork);
  }, [selectedArtwork]);

  const handleOpenDialog = (artwork, mode) => {
    const artworkWithId = {
      ...artwork.artworkDto,
      displayImage: artwork.displayImage,
    };
    setSelectedArtwork(artworkWithId);
    setDialogMode(mode);
    setOpenDialog(true);
    if (mode === "bids") {
      fetchBids(artworkWithId.artworkId);
    }
  };

  const fetchBids = (artworkId) => {
    axiosInstance
      .get(`/bid/artwork/${artworkId}/bids`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => setBids(response.data))
      .catch((error) => console.error("Error:", error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewDescription("");
  };

  const handleUpdateDescription = () => {
    axiosInstance
      .put(
        `/art/${selectedArtwork.artworkId}`,
        { newDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        const updatedArtworks = artworks.map((artwork) => {
          if (artwork.artworkDto.artworkId === selectedArtwork.artworkId) {
            return {
              ...artwork,
              artworkDto: {
                ...artwork.artworkDto,
                artworkDescription: newDescription,
              },
            };
          }
          return artwork;
        });
        setArtworks(updatedArtworks);
        handleCloseDialog();
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleApproveRejectBid = (bidId, approve) => {
    const apiEndpoint = approve
      ? `/bid/approve/${bidId}`
      : `/bid/reject/${bidId}`;
    axiosInstance
      .put(
        apiEndpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        fetchBids(selectedArtwork.artworkId);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <>
      <Header />
      <Button
        href="/upload-artwork"
        variant="outlined"
        sx={{
          mt: 3,
          mb: 2,
          alignSelf: "flex-start",
        }}
      >
        Upload Artwork
      </Button>
      <Typography
        sx={{
          fontFamily: "Segoe UI",
          fontWeight: 200,
          fontSize: 36,
          marginTop: "2vh",
        }}
      >
        My Portfolio
      </Typography>
      <Grid
        container
        spacing={4}
        style={{ padding: 24, justifyContent: "center", alignItems: "center" }}
      >
        {artworks.length ? (
          artworks.map((artwork, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardActionArea
                  onClick={() => handleOpenDialog(artwork, "update")}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`data:image/jpeg;base64,${artwork.displayImage}`}
                    alt={artwork.artworkName}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {artwork.artworkDto.artworkName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {artwork.artworkDto.artworkDescription}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {artwork.artworkDto.artistName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Button onClick={() => handleOpenDialog(artwork, "bids")}>
                  Approve/Reject Bids
                </Button>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ marginTop: "20px" }}>
            There are no artworks in your portfolio
          </Typography>
        )}
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {dialogMode === "update"
            ? "Update Description"
            : "Approve/Reject Bids"}
        </DialogTitle>
        <DialogContent>
          {dialogMode === "update" ? (
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="New Description"
              type="text"
              fullWidth
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          ) : (
            <List>
              {bids.map((bid) => (
                <React.Fragment key={bid.bidId}>
                  <ListItem>
                    <ListItemText
                      primary={`Bid Amount: $${bid.bidAmount}`}
                      secondary={`Bidder ID: ${bid.userId}`}
                    />
                    <Button
                      onClick={() => handleApproveRejectBid(bid.bidId, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleApproveRejectBid(bid.bidId, false)}
                    >
                      Reject
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          {dialogMode === "update" && (
            <Button onClick={handleUpdateDescription} color="primary">
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
