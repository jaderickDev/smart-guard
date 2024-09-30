import React from "react";

const CameraFeed = () => {
  return (
    <div>
      <h1>Live Camera Feed</h1>
      {/* Render the video stream */}
      <img
        src="http://localhost:8000/video_feed/"
        alt="Camera Feed"
        style={{ width: "600px", height: "auto" }}
      />
    </div>
  );
};

export default CameraFeed;
