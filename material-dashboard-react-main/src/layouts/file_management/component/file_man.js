import React, { useEffect, useState } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get CSRF token
const getCSRFToken = () => {
  const csrftoken = Cookies.get("csrftoken");
  return csrftoken || "";
};

// Add request interceptor to include CSRF token
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["X-CSRFToken"] = getCSRFToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function File() {
  const [alerts, setAlerts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await axiosInstance.get("/api/csrf/"); // Endpoint to get CSRF token
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    fetchCSRFToken();
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get("/api/alerts/");
      setAlerts(response.data.alerts);
    } catch (error) {
      showNotification("Error fetching alerts", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/alerts/${id}`);
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
      showNotification("Alert deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting alert:", error);
      showNotification("Failed to delete the alert", "error");
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/alerts/${id}`);
      window.open(response.data.frame_image, "_blank");
    } catch (error) {
      showNotification("Error viewing alert", "error");
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/alerts/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Alert_${id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification("Download started successfully", "success");
    } catch (error) {
      showNotification("Error downloading alert", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    columns: [
      { Header: "File Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Date & Time", accessor: "date", align: "left" },
      { Header: "View", accessor: "view", align: "center" },
      { Header: "Delete", accessor: "delete", align: "center" },
      { Header: "Download", accessor: "download", align: "center" },
    ],

    rows: alerts.map((alert) => ({
      name: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDAvatar src={alert.frame_image} name={`Alert_${alert.id}`} size="sm" />
          <MDBox ml={2} lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              Alert_{alert.id}
            </MDTypography>
          </MDBox>
        </MDBox>
      ),
      date: <MDTypography variant="caption">{formatDate(alert.detected_at)}</MDTypography>,
      view: (
        <MDBadge
          badgeContent="View"
          color="success"
          variant="gradient"
          size="sm"
          onClick={() => handleView(alert.id)}
          style={{ cursor: "pointer" }}
        />
      ),
      delete: (
        <MDBadge
          badgeContent="Delete"
          color="error"
          variant="gradient"
          size="sm"
          onClick={() => handleDelete(alert.id)}
          style={{ cursor: "pointer" }}
        />
      ),
      download: (
        <MDBadge
          badgeContent="Download"
          color="info"
          variant="gradient"
          size="sm"
          onClick={() => handleDownload(alert.id)}
          style={{ cursor: "pointer" }}
        />
      ),
    })),
  };
}
