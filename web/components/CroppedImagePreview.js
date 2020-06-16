import React from "react";

import FullscreenImageModal from "./FullscreenImageModal";
const CroppedImagePreview = ({ croppedImageUrl, croppedImageName }) => {
  return (
    <div
      className="column"
      style={{
        display: croppedImageUrl ? "inline-block" : "none",
      }}
    >
      <div>
        <div className="field">
          <div className="control">
            <h2>{`${croppedImageName} - (cropped)`}</h2>
          </div>
        </div>
        <div className="field">
          <div class="control">
            <img src={croppedImageUrl}></img>
            <FullscreenImageModal imageUrl={croppedImageUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CroppedImagePreview;
