import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function SpinningLoader({
  size = "medium",
  color = "#3498db",
  text = "Loading...",
}) {
  const [isRotating, setIsRotating] = useState(true);

  // Map size to actual pixel values
  const sizeMap = {
    small: {
      outer: "w-8 h-8",
      inner: "w-6 h-6",
      text: "text-xs",
    },
    medium: {
      outer: "w-12 h-12",
      inner: "w-10 h-10",
      text: "text-sm",
    },
    large: {
      outer: "w-16 h-16",
      inner: "w-14 h-14",
      text: "text-base",
    },
  };

  const selectedSize = sizeMap[size] || sizeMap.medium;

  // Simulate continuous rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsRotating((prev) => !prev);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${selectedSize.outer} relative flex items-center justify-center`}
      >
        {/* Outer circle */}
        <div
          className={`absolute animate-spin rounded-full border-4 border-t-transparent ${selectedSize.outer}`}
          style={{ borderColor: `${color}33`, borderTopColor: "transparent" }}
        ></div>

        {/* Inner circle - rotates faster */}
        <div
          className={`absolute animate-spin rounded-full border-4 border-t-transparent ${selectedSize.inner}`}
          style={{
            borderColor: color,
            borderTopColor: "transparent",
            animationDuration: "0.6s",
          }}
        ></div>
      </div>

      {text && (
        <div className={`mt-2 ${selectedSize.text} text-gray-600`}>{text}</div>
      )}
    </div>
  );
}

SpinningLoader.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
};

export default SpinningLoader;
