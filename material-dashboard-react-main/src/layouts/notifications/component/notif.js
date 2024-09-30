import React, { useEffect, useState } from 'react';

const closeErrorSB = () => setErrorSB(false);  

const TrashNotification = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch alerts every few seconds
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:8000/get_alerts/");
        if (!response.ok) throw new Error("Failed to fetch alerts");

        const data = await response.json();
        setAlerts(data.alerts);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch alerts immediately and every 10 seconds
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // 10-second intervals

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Trash Detection Alerts</h2>
      {error ? <p>Error fetching alerts: {error}</p> : null}
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>
            <strong>Time:</strong> {alert.detected_at}, <strong>Location:</strong> {alert.location}{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrashNotification;
