import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, Button, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios"; // Make sure this import is present

function CCTVGrid({ cameras, onError, onStopStreaming, onRemoveCamera }) {
  const handleStopStreaming = async () => {
    try {
      // Send the list of camera IDs to stop
      const cameraIds = cameras.map((camera) => camera.id);
      await axios.post("http://localhost:8000/api/stop_streaming/", {
        camera_ids: cameraIds,
      });

      // Stop all video elements to ensure resources are released
      const videoElements = document.querySelectorAll("video");
      videoElements.forEach((video) => {
        const stream = video.srcObject;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        video.srcObject = null;
      });

      onStopStreaming(); // Clear all cameras from state
    } catch (error) {
      console.error("Error stopping stream:", error);
      onError(error);
    }
  };

  const renderCameraFeed = (camera, index) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={index}>
        {camera.type === "cctv" ? (
          <video
            key={camera.id}
            src={camera.streamUrl}
            autoPlay
            controls
            style={{ width: "100%", height: "auto" }}
            onError={(e) => {
              console.error(`Error with camera ${camera.id}:`, e);
              onError(e);
            }}
          />
        ) : (
          <img src={camera.streamUrl} alt="Camera feed" style={{ width: "100%", height: "auto" }} />
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
        <Box display="flex" justifyContent="flex-start" mt={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleStopStreaming}
            startIcon={<CloseIcon />}
            sx={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
          >
            Stop All Camera Feeds
          </Button>
        </Box>
      )}
    </>
  );
}

CCTVGrid.propTypes = {
  cameras: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
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
