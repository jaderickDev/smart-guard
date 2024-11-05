import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import PieChart from "examples/Charts/PieChart";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import { Button } from "@mui/material";

function ReportAnalysis() {
  const [reports, setReports] = useState([]);
  const [timeFrame, setTimeFrame] = useState("daily");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`/api/reports?timeFrame=${timeFrame}`);
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, [timeFrame]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={2}>
        <MDBox mb={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h1>Littering Report Analysis</h1>
              <div>
                <Button onClick={() => setTimeFrame("daily")}>Daily</Button>
                <Button onClick={() => setTimeFrame("weekly")}>Weekly</Button>
                <Button onClick={() => setTimeFrame("monthly")}>Monthly</Button>
                <Button onClick={() => setTimeFrame("yearly")}>Yearly</Button>
              </div>
              <MDBox mt={2}>
                <DefaultLineChart
                  icon={{ color: "info", component: "leaderboard" }}
                  title="Default Line Chart"
                  description="Product insights"
                  chart={{
                    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [
                      {
                        label: "Organic Search",
                        color: "info",
                        data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
                      },
                      {
                        label: "Referral",
                        color: "dark",
                        data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
                      },
                      {
                        label: "Direct",
                        color: "primary",
                        data: [40, 80, 70, 90, 30, 90, 140, 130, 200],
                      },
                    ],
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PieChart
                icon={{ color: "info", component: "leaderboard" }}
                title="Pie Chart"
                description="Percentage of litter in a week"
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
      </MDBox>
    </DashboardLayout>
  );
}

export default ReportAnalysis;
