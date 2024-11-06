import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios"; // Make sure this import is present

function CCTVGrid({ cameras, onError, onStopStreaming, onRemoveCamera }) {
  const handleStopStreaming = async () => {
    try {
      await axios.post("http://localhost:8000/api/stop_streaming/"); // Update this URL
      onStopStreaming();
    } catch (error) {
      console.error("Error stopping stream:", error);
    }
  };

  const renderCameraFeed = (camera, index) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={index}>
        {camera.type === "cctv" ? (
          <video
            src={camera.streamUrl}
            autoPlay
            controls
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <img
            src={camera.streamUrl}
            alt={`Webcam ${index}`}
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </Grid>
    );
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
              <h2 style={{ color: "red" }}>NO VIDEO DISPLAY</h2>
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
