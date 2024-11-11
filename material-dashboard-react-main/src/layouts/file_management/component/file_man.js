import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import PropTypes from "prop-types";

// Images
import team2 from "assets/images/team-2.png";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function file() {
  const Author = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  Author.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  Job.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  };

  return {
    columns: [
      { Header: "File Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Date & Time", accessor: "date", align: "left" },
      { Header: "Photos", accessor: "view", align: "center" },
      { Header: "Delete", accessor: "delete", align: "center" },
      { Header: "Download", accessor: "download", align: "center" },
    ],

    rows: [
      {
        name: <Author image={team2} name="Litter Detected_01" />,
        date: <Job title="10:00 AM" description="" />,
        view: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="View" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        delete: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Delete"
              color="error"
              variant="gradient"
              size="sm"
              onClick={() => alert("Delete Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
        download: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Download"
              color="info"
              variant="gradient"
              size="sm"
              onClick={() => alert("Download Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
      },
      {
        name: <Author image={team2} name="Litter Detected_02" />,
        date: <Job title="10:00 AM" description="" />,
        view: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="View" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        delete: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Delete"
              color="error"
              variant="gradient"
              size="sm"
              onClick={() => alert("Delete Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
        download: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Download"
              color="info"
              variant="gradient"
              size="sm"
              onClick={() => alert("Download Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
      },
      {
        name: <Author image={team2} name="Litter Detected_03" />,
        date: <Job title="10:00 AM" description="" />,
        view: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="View" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        delete: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Delete"
              color="error"
              variant="gradient"
              size="sm"
              onClick={() => alert("Delete Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
        download: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Download"
              color="info"
              variant="gradient"
              size="sm"
              onClick={() => alert("Download Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
      },
      {
        name: <Author image={team2} name="Litter Detected_04" />,
        date: <Job title="10:00 AM" description="" />,
        view: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="View" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        delete: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Delete"
              color="error"
              variant="gradient"
              size="sm"
              onClick={() => alert("Delete Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
        download: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Download"
              color="info"
              variant="gradient"
              size="sm"
              onClick={() => alert("Download Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
      },
      {
        name: <Author image={team2} name="Litter Detected_05" />,
        date: <Job title="10:00 AM" description="" />,
        view: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="View" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        delete: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Delete"
              color="error"
              variant="gradient"
              size="sm"
              onClick={() => alert("Delete Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
        download: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Download"
              color="info"
              variant="gradient"
              size="sm"
              onClick={() => alert("Download Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
      },
      {
        name: <Author image={team2} name="Litter Detected_06" />,
        date: <Job title="10:00 AM" description="" />,
        view: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="View" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        delete: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Delete"
              color="error"
              variant="gradient"
              size="sm"
              onClick={() => alert("Delete Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
        download: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Download"
              color="info"
              variant="gradient"
              size="sm"
              onClick={() => alert("Download Item")}
              style={{ cursor: "pointer" }}
            />
          </MDBox>
        ),
      },
    ],
  };
}
