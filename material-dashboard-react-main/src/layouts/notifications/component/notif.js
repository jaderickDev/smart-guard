import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const TrashNotification = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/get_alerts/");
        if (!response.ok) throw new Error("Failed to fetch alerts");

        const data = await response.json();
        setAlerts(data.alerts);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Trash Detection Alerts
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {loading && <CircularProgress />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error fetching alerts: {error}
        </Alert>
      )}

      {!loading && !error && alerts.length === 0 && (
        <Alert severity="info">No trash incidents reported.</Alert>
      )}

      <List>
        {alerts.map((alert, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <DeleteIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" color="text.primary">
                    Trash Incident Detected
                  </Typography>
                }
                secondary={
                  <Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(alert.detected_at).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {alert.location}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < alerts.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default TrashNotification;
