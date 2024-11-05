import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, CardMedia, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios"; // Make sure this import is present

function CCTVGrid({ cameras, defaultImageSrc, onError, onStopStreaming, onRemoveCamera }) {
  const renderCameraFeed = (camera, index) => (
    <Grid item xs={6} sm={6} md={3} key={index}>
      <Card>
        <CardMedia
          component="img"
          height="200"
          image={camera ? camera.streamUrl : defaultImageSrc}
          alt={`Camera ${index + 1}`}
          onError={onError}
          style={{ objectFit: "cover" }}
        />
        <IconButton
          aria-label="close"
          onClick={() => onRemoveCamera(index)}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Button
          variant="outlined"
          onClick={() => alert(`Enlarging Camera ${index + 1}`)}
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          Enlarge
        </Button>
      </Card>
    </Grid>
  );

  const handleStopStreaming = async () => {
    try {
      await axios.post("http://localhost:8000/api/stop_streaming/"); // Update this URL
      onStopStreaming();
    } catch (error) {
      console.error("Error stopping stream:", error);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {cameras.length === 0 ? (
          <Grid item xs={12}>
            <Card
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h2>NO VIDEO DISPLAY</h2>
            </Card>
          </Grid>
        ) : (
          cameras.map((camera, index) => renderCameraFeed(camera, index))
        )}
      </Grid>
      {cameras.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleStopStreaming}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#d32f2f",
            color: "white",
            "&:hover": {
              backgroundColor: "#c62828",
            },
          }}
        >
          Stop All Camera Feeds
        </Button>
      )}
    </>
  );
}

CCTVGrid.propTypes = {
  cameras: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      streamUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
  defaultImageSrc: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  onStopStreaming: PropTypes.func.isRequired,
  onRemoveCamera: PropTypes.func.isRequired,
};

export default CCTVGrid;
