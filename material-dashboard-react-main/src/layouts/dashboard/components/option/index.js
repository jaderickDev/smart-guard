import React, { useState } from "react";
import PropTypes from "prop-types";

const CameraSelection = ({ onCameraSelect }) => {
  const [cameraType, setCameraType] = useState("webcam");
  const [ipAddress, setIpAddress] = useState("");

  const handleCameraChange = (event) => {
    setCameraType(event.target.value);
    if (event.target.value === "webcam") {
      setIpAddress("");
    }
  };

  const handleIpChange = (event) => {
    setIpAddress(event.target.value);
  };

  const handleSubmit = () => {
    if (cameraType === "ip" && !ipAddress) {
      alert("Please enter a valid IP address");
      return;
    }
    const streamUrl = cameraType === "ip" ? `http://${ipAddress}/video` : null;
    onCameraSelect(cameraType, streamUrl);
  };

  return (
    <div>
      <h2>Select Camera</h2>
      <div>
        <label>
          <input
            type="radio"
            value="webcam"
            checked={cameraType === "webcam"}
            onChange={handleCameraChange}
          />
          Webcam
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="ip"
            checked={cameraType === "ip"}
            onChange={handleCameraChange}
          />
          IP Camera
        </label>
      </div>
      {cameraType === "ip" && (
        <div>
          <label>
            Enter IP address:
            <input
              type="text"
              value={ipAddress}
              onChange={handleIpChange}
              placeholder="e.g., rtsp://192.168.0.1"
            />
          </label>
        </div>
      )}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

CameraSelection.propTypes = {
  onCameraSelect: PropTypes.func.isRequired, // Validate the prop type
};

export default CameraSelection;
