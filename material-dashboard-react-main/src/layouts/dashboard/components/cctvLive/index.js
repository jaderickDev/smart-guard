import React from "react";
import PropTypes from "prop-types";

const CameraFeed = ({ defaultImageSrc }) => {
  const [isVideoAvailable, setIsVideoAvailable] = useState(true);

  // Simulate video load (can be adjusted depending on real conditions)
  useEffect(() => {
    if (!videoSrc) {
      setIsVideoAvailable(false);
    }
  }, [videoSrc]);

  const handleVideoError = () => {
    setIsVideoAvailable(false);
  };

  return (
    <div>
      {isVideoAvailable ? (
        <video src={videoSrc} onError={handleVideoError} autoPlay controls width="600" />
      ) : (
        <img src={defaultImageSrc} alt="Default placeholder" width="600" />
      )}
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
CameraFeed.propTypes = {
  defaultImageSrc: PropTypes.string.isRequired,
};
export default CameraFeed;
