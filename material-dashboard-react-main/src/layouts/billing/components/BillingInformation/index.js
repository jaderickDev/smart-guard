/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Bill from "layouts/billing/components/Bill";

const BillingInformation = ({ cameraIndex }) => {
  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium"></MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <div style={{ margin: "10px" }}>
            <h3>Camera {cameraIndex + 1}</h3>
            <img
              src={`http://127.0.0.1:5000/video_feed/${cameraIndex}`}
              alt={`Camera ${cameraIndex + 1}`}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </MDBox>
      </MDBox>
    </Card>
  );
};

BillingInformation.propTypes = {
  cameraIndex: PropTypes.number.isRequired,
};

export default BillingInformation;
