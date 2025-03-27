"use client";

import "../../../styles/components/_loadingSpinner.scss"; // Import SCSS globally

export default function LoadingSpinner() {
  return (
    <div className="spinnerContainer">
      <div className="spinner"></div>
    </div>
  );
}
