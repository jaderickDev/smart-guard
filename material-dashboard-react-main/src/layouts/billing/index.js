import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import PieChart from "examples/Charts/PieChart";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";

function ReportAnalysis() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  // New data for incidents
  const incidentData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Number of Incidents",
        data: [
          ,
          ,/* daily incidents */
          /* weekly incidents */
          /* monthly incidents */
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // New data for types of litter
  const litterTypesData = {
    labels: ["Plastic", "Paper", "Metal", "Glass"],
    datasets: [
      {
        label: "Types of Litter Detected",
        data: [
          ,
          ,
          ,/* plastic count */
          /* paper count */
          /* metal count */
          /* glass count */
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
      },
    ],
  };

  // New data for locations of incidents
  const locationData = {
    labels: ["Camera 1", "Camera 2"],
    datasets: [
      {
        label: "Location of Incidents",
        data: [
          ,/* camera 1 incidents */
          /* camera 2 incidents */
        ],
        backgroundColor: ["rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)"],
      },
    ],
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h1>Littering Report Analysis</h1>
              <PieChart
                icon={{ color: "info", component: "leaderboard" }}
                title="Pie Chart"
                description="Analytics Insights"
                chart={{
                  labels: ["Facebook", "Direct", "Organic", "Referral"],
                  datasets: {
                    label: "Projects",
                    backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
                    data: [15, 20, 12, 60],
                  },
                }}
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* New section for incidents line chart */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h2>Number of Incidents</h2>
              <DefaultLineChart
                chart={{
                  labels: incidentData.labels,
                  datasets: incidentData.datasets,
                }}
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* New section for types of litter bar chart */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h2>Types of Litter Detected</h2>
              <VerticalBarChart
                chart={{
                  labels: litterTypesData.labels,
                  datasets: litterTypesData.datasets,
                }}
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* New section for locations pie chart */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h2>Location of Incidents</h2>
              <PieChart
                chart={{
                  labels: locationData.labels,
                  datasets: locationData.datasets,
                }}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default ReportAnalysis;
