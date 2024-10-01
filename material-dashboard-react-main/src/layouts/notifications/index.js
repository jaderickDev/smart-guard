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
import TrashNotification from "./component/notif";

function Notifications() {
  <DashboardLayout>
    <DashboardNavbar>
      <MDBox>
        <Grid>
          <Grid>
            <Card>
              <MDBox>
                <TrashNotification />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardNavbar>
  </DashboardLayout>;
}

export default Notifications;
