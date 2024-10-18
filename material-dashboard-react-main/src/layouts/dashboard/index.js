import React, { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CameraSelection from "./components/cctvLive/cameraselection";
import CCTVGrid from "./components/cctvLive";

function CCTV() {
  const defaultImageSrc = "../assets/images/bg-profile.jpeg";
  const [selectedCamera, setSelectedCamera] = useState(null);
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleCameraSelect = async (cameraType, streamOrUrl) => {
    if (cameraType === "webcam") {
      try {
        // For webcam, we'll use the Django backend stream
        setSelectedCamera({
          type: cameraType,
          streamUrl: "http://localhost:8000/video_feed/", // Update this URL to match your Django server
        });
        setIsStreaming(true);
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert(
          "Failed to access webcam. Please make sure you have granted the necessary permissions."
        );
      }
    } else if (cameraType === "ip") {
      setSelectedCamera({
        type: cameraType,
        streamUrl: streamOrUrl,
      });
      setIsStreaming(true);
    }
  };

  const stopStreaming = () => {
    setSelectedCamera(null);
    setIsStreaming(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <CameraSelection onCameraSelect={handleCameraSelect} />
              {isStreaming && (
                <CCTVGrid
                  cameras={selectedCamera ? [selectedCamera] : []}
                  defaultImageSrc={defaultImageSrc}
                  onError={(error) => console.error("CCTV Stream Error:", error)}
                  onStopStreaming={stopStreaming}
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
