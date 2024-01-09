import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../service/axiosInterceptor";
import { useNavigate } from "react-router-dom";

export default function UploadArtwork() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [mediums, setMediums] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [types, setTypes] = useState([]);
  const [medium, setMedium] = useState("");
  const [material, setMaterial] = useState("");
  const [rarity, setRarity] = useState("");
  const [type, setType] = useState("");

  const handleChangeMedium = (event) => {
    setMedium(event.target.value);
  };
  const handleChangeRarity = (event) => {
    setRarity(event.target.value);
  };
  const handleChangeMaterial = (event) => {
    setMaterial(event.target.value);
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    axiosInstance
      .get(`/art/mediums`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setMediums(response.data.data);
        console.log("MEDİUMSSSSSS", response.data.data);
      })
      .catch((error) => console.error("Error:", error));

    axiosInstance
      .get(`/art/materials`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setMaterials(response.data.data);
        console.log("MATERIALSSSSSS", response.data.data);
      })
      .catch((error) => console.error("Error:", error));

    axiosInstance
      .get(`/art/types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setTypes(response.data.data);
        console.log("TYPES", response.data.data);
      })
      .catch((error) => console.error("Error:", error));

    axiosInstance
      .get(`/art/rarities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setRarities(response.data.data);
        console.log("RARITIES", response.data.data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const navigate = useNavigate();

  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
    console.log("image", image);
  }

  const handleUpload = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      image: image,
      name: data.get("artwork-title"),
      userId: "1234",
      artistId: "1234",
      fixedPrice: data.get("reserve-price"),
      artworkTypeId: type,
      timePeriod: "1234",
      rarityId: rarity,
      mediumId: medium,
      sizeX: data.get("size-x"),
      sizeY: data.get("size-y"),
      sizeZ: data.get("size-z"),
      materialId: material,
      artworkLocation: "Istanbul",
      artMovementId: data.get("movement"),
      acquisitionWay: "1234",
      artworkDescription: data.get("description"),
    });

    var formData = new FormData();

    formData.append("image", image);
    formData.append("name", data.get("artwork-title"));
    formData.append("fixedPrice", data.get("reserve-price"));
    formData.append("artworkTypeId", type);
    formData.append("timePeriod", "1234");
    formData.append("rarityId", rarity);
    formData.append("mediumId", medium);
    formData.append("sizeX", data.get("size-x"));
    formData.append("sizeY", data.get("size-y"));
    formData.append("sizeZ", data.get("size-z"));
    formData.append("materialId", material);
    formData.append("artworkLocation", data.get("location"));
    formData.append("artMovementId", 3);
    formData.append("acquisitionWay", "4321");
    formData.append("artworkDescription", data.get("description"));

    const res = await axiosInstance.post("/art/upload", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  };

  return (
    <>
      <Header />
      <Grid
        container
        component="form"
        onSubmit={handleUpload}
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
        <Typography
          sx={{
            fontFamily: "Segoe UI",
            fontWeight: 700,
            fontSize: 42,
            marginTop: "2vh",
          }}
        >
          Upload Artwork
        </Typography>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            p: 3,
            width: "100vw",
          }}
        >
          <Grid
            component={Paper}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              height: "95vh",
              width: "98%",
              borderRadius: 5,
              boxShadow: 3,
            }}
          >
            <TextField
              id="artwork-title"
              name="artwork-title"
              label="Artwork Title"
              variant="outlined"
              sx={{ width: "30%" }}
              placeholder="Enter your artwork title here"
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              placeholder="Tell us about your artwork!"
              sx={{ width: "50%" }}
            />
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
                p: 3,
                width: "100%",
              }}
            >
              Details:
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label" width="20%">
                  Artwork Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Type"
                  onChange={handleChangeType}
                >
                  {(types || []).map((type) => (
                    <MenuItem value={type.artworkTypeId}>
                      {type.artworkTypeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label" width="20%">
                  Rarity
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={rarity}
                  label="Rarity"
                  onChange={handleChangeRarity}
                >
                  {(rarities || []).map((rar) => (
                    <MenuItem value={rar.rarityId}>{rar.rarityName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label" width="20%">
                  Medium
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={medium}
                  label="Medium"
                  onChange={handleChangeMedium}
                >
                  {(mediums || []).map((medium) => (
                    <MenuItem value={medium.mediumId}>
                      {medium.mediumName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label" width="20%">
                  Material
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={material}
                  label="Material"
                  onChange={handleChangeMaterial}
                >
                  {(materials || []).map((mat) => (
                    <MenuItem value={mat.materialId}>
                      {mat.materialName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="movement"
                name="movement"
                label="Movement"
                variant="outlined"
                sx={{ width: "20%" }}
                placeholder="Enter movement"
              />
            </Grid>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
                p: 3,
                width: "100%",
              }}
            >
              <TextField
                id="location"
                name="location"
                label="Location"
                variant="outlined"
                sx={{ width: "20%" }}
                placeholder="Enter location"
              />
              <TextField
                id="acquisition-way"
                name="acquisition-way"
                label="Acquisition Way"
                variant="outlined"
                sx={{ width: "20%" }}
                placeholder="Enter acquisition way"
              />
              <TextField
                id="time-period"
                name="time-period"
                label="Time period"
                variant="outlined"
                sx={{ width: "20%" }}
                placeholder="Enter time period"
              />
            </Grid>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              Sizes:
              <TextField
                id="size-x"
                name="size-x"
                label="Size (X)"
                variant="outlined"
                sx={{ width: "15%" }}
                placeholder="Enter material"
              />
              <TextField
                id="size-y"
                name="size-y"
                label="Size (Y)"
                variant="outlined"
                sx={{ width: "15%" }}
                placeholder="Enter material"
              />
              <TextField
                id="size-z"
                name="size-z"
                label="Size (Z)"
                variant="outlined"
                sx={{ width: "15%" }}
                placeholder="Enter material"
              />
            </Grid>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Typography>Reserved Price: </Typography>
              <TextField
                id="reserve-price"
                name="reserve-price"
                label="Reserve Price"
                variant="outlined"
                sx={{ width: "20%" }}
                placeholder="Set reserve price"
              />
              <Divider orientation="vertical" flexItem />
              <Typography>Auction: </Typography>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <TextField
                  id="initial-bid"
                  name="initial-bid"
                  label="Initial Bid"
                  variant="outlined"
                  sx={{ width: "20%" }}
                  placeholder="Set initial bid"
                />
                <TextField
                  id="start-date"
                  name="start-date"
                  label="Auction Start Date"
                  variant="outlined"
                  sx={{ width: "30%" }}
                  placeholder="Set Start Date"
                />
                <TextField
                  id="end-date"
                  name="end-date"
                  label="Auction End Date"
                  variant="outlined"
                  sx={{ width: "30%" }}
                  placeholder="Set End Date"
                />
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
              }}
            >
              <img src={file} alt="uploaded" width={"100"} />
              <input type="file" onChange={handleChange} />
            </Grid>
            <Button
              variant="contained"
              sx={{ width: "40%", backgroundColor: "#246d82" }}
              type="submit"
            >
              Upload
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
