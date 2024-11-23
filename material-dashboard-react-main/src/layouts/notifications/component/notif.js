import React, { useEffect, useState } from "react";
import axios from "axios";

const Notif = () => {
  const [alerts, setAlerts] = useState([]);
  const fetchAlerts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/alerts/"); // Update the URL as needed
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Fetch alerts every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h3>Recent Activities</h3>
      <ul>
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <li key={alert.id}>
              <p>
                Detected at: {alert.detected_at} in {alert.location}
              </p>
            </li>
          ))
        ) : (
          <li>No alerts yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Notif;
