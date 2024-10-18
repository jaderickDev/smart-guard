import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, CardMedia, Button } from "@mui/material";

function CCTVGrid({ cameras, defaultImageSrc, onError, onStopStreaming }) {
  const renderCameraFeed = (camera, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card>
        <CardMedia
          component="img"
          height="200"
          image={camera ? camera.streamUrl : defaultImageSrc}
          alt={`Camera ${index + 1}`}
          onError={onError}
          style={{ objectFit: "cover" }}
        />
      </Card>
    </Grid>
  );

  return (
    <>
      <Grid container spacing={2}>
        {cameras.map((camera, index) => renderCameraFeed(camera, index))}
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        onClick={onStopStreaming}
        style={{ marginTop: "20px" }}
      >
        Stop Streaming
      </Button>
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
};

export default CCTVGrid;
