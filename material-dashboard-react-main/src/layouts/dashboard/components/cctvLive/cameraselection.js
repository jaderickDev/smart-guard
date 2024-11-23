import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import LanguageIcon from "@mui/icons-material/Language";

function CameraSelection({ onCameraSelect }) {
  const [cameraType, setCameraType] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cameraType === "webcam") {
      onCameraSelect(cameraType, null);
    } else if (cameraType === "ip") {
      const streamUrl = `http://${ipAddress}/video`;
      onCameraSelect(cameraType, streamUrl);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "0" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Camera Selection
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ width: "100%" }} margin="normal">
            <InputLabel id="camera-type-label">Camera Type</InputLabel>
            <Select
              labelId="camera-type-label"
              value={cameraType}
              onChange={(e) => setCameraType(e.target.value)}
              required
              label="Camera Type"
            >
              <MenuItem value="webcam">
                <Box display="flex" alignItems="center">
                  <VideocamIcon style={{ marginRight: 8 }} />
                  Webcam
                </Box>
              </MenuItem>
              <MenuItem value="ip">
                <Box display="flex" alignItems="center">
                  <LanguageIcon style={{ marginRight: 8 }} />
                  IP Camera
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          {cameraType === "ip" && (
            <TextField
              fullWidth
              margin="normal"
              label="IP Address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              required
              variant="outlined"
            />
          )}
          {cameraType === "ip" && (
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="outlined"
            />
          )}
          {cameraType === "ip" && (
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
            />
          )}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" startIcon={<VideocamIcon />}>
              Connect Camera
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}

CameraSelection.propTypes = {
  onCameraSelect: PropTypes.func.isRequired,
};

export default CameraSelection;
