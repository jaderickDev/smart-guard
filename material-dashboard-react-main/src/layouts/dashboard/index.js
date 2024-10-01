import React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import CameraFeed from "./components/cctvLive";
import CameraSelection from "./components/option";

function CCTV() {
  const defaultImageSrc = "src/assets/images/ivana-squarejpg."; // Path to your default image

  const handleCameraSelect = (cameraType, ipAddress) => {
    if (cameraType === "webcam") {
      console.log("Webcam selected");
    } else if (cameraType === "ip") {
      console.log("IP Camera selected with IP:", ipAddress);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <CameraSelection
                onCameraSelect={handleCameraSelect}
                videoSrc={videoSrc}
                defaultImageSrc={defaultImageSrc}
              />
              <CameraFeed />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default CCTV;
