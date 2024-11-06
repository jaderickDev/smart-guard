import React, { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CameraSelection from "./components/cctvLive/cameraselection";
import CCTVGrid from "./components/cctvLive";

function CCTV() {
  const defaultImageSrc = "../assets/images/bg-profile.jpeg";
  const [cameras, setCameras] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleCameraSelect = async (cameraType, streamOrUrl) => {
    const newCamera = {
      type: cameraType,
      streamUrl: cameraType === "webcam" ? "http://localhost:8000/video_feed/" : streamOrUrl,
    };

    setCameras((prevCameras) => [...prevCameras, newCamera]);
    setIsStreaming(true);
  };

  const stopStreaming = () => {
    setCameras([]);
    setIsStreaming(false);
  };

  const removeCamera = (index) => {
    setCameras((prevCameras) => prevCameras.filter((_, i) => i !== index));
    if (cameras.length === 1) {
      setIsStreaming(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} borderRadius="4px">
        <MDBox borderRadius="4px">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CameraSelection onCameraSelect={handleCameraSelect} />
              {isStreaming && (
                <CCTVGrid
                  cameras={cameras}
                  defaultImageSrc={defaultImageSrc}
                  onError={(error) => {
                    console.error("CCTV Stream Error:", error);
                  }}
                  onStopStreaming={stopStreaming}
                  onRemoveCamera={removeCamera}
                />
              )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default CCTV;
