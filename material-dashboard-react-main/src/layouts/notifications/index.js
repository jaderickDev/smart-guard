import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Notif from "./component/notif";

function Notifications() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} sx={{ flexGrow: 1, height: "calc(100vh - 64px)" }}>
        <Grid container sx={{ height: "100%" }}>
          <Grid item xs={12} sx={{ height: "100%" }}>
            <Card sx={{ height: "100%" }}>
              <MDBox sx={{ height: "100%", overflow: "auto" }}>
                <Notif />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
