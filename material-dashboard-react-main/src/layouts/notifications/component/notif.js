import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AlertDetails = ({ alertId }) => {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch alert data from Django API
    fetch(`/api/alerts/${alertId}/`)
      .then((response) => response.json())
      .then((data) => setAlert(data))
      .catch((error) => console.error("Error fetching alert:", error));
  }, [alertId]);

  const handleBack = () => {
    navigate("/");
  };

  if (!alert) {
    return <p>Loading alert details...</p>;
  }

  return (
    <div className="col-md-6">
      <div className="details" style={{ marginTop: "40px" }}>
        <h5 className="card-title">Camera Location: {{ alert, location }}</h5>
        <p className="card-text">
          <strong>Detected At:</strong> {{ alert, detected_at }}
        </p>
        <button onClick={handleBack} className="btn btn-success mt-3">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

AlertDetails.propTypes = {
  alertId: PropTypes.string,
};

AlertDetails.defaultProps = {
  alertId: null,
};

export default AlertDetails;
