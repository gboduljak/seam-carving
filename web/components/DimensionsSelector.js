import React from "react";
import ReactCrop from "react-image-crop";

export default class DimensionsSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      crop: {
        unit: "%",
        width: 50,
        height: 50,
      },
    };
  }

  onImageSelected = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({
          src: reader.result,
        })
      );
      this.setState({
        srcFilename: e.target.files[0].name,
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
    this.setState({
      dimensions: {
        height: image.offsetHeight,
        width: image.offsetWidth,
      },
    });
  };

  onCropSelectionCompleted = (crop) => {
    const { onDimensionsSelected } = this.props;
    const { dimensions } = this.state;
    onDimensionsSelected({
      model: this.getRequestModel(crop),
      crop,
      dimensions,
    });
  };

  onCropSelectionChanged = (crop) => {
    this.setState({ crop });
  };

  getRequestModel(crop) {
    const { src, dimensions } = this.state;
    if (!dimensions) return undefined;

    const { width, height } = dimensions;

    if (this.imageRef && crop.width && crop.height) {
      const seamCarvingFormData = new FormData();
      seamCarvingFormData.set("image", src);
      seamCarvingFormData.set("crop_rows", parseInt(width - crop.width));
      seamCarvingFormData.set("crop_cols", parseInt(height - crop.height));
      return seamCarvingFormData;
    }
    return undefined;
  }

  render() {
    const { crop, src, srcFilename } = this.state;
    const { croppedImageUrl } = this.props;
    return (
      <div>
        <div className="is-flex is-horizontal-center">
          <div className="file has-name">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={this.onImageSelected}
              ></input>
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">Choose an image…</span>
              </span>
              <span className="file-name">{srcFilename}</span>
            </label>
          </div>
        </div>
        <br />
        <div className="columns">
          <div className="column">
            <form>
              <div className="field">
                <div className="control">
                  <h2>Selected image</h2>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  {src && (
                    <ReactCrop
                      src={src}
                      crop={crop}
                      ruleOfThirds
                      onImageLoaded={this.onImageLoaded}
                      onComplete={this.onCropSelectionCompleted}
                      onChange={this.onCropSelectionChanged}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
          <div
            className="column"
            style={{ display: croppedImageUrl ? "flex" : "none" }}
          >
            <form>
              <div className="field">
                <div className="control">
                  <h2>Cropped image</h2>
                </div>
              </div>
              <div className="field">
                <div class="control">
                  <img src={croppedImageUrl}></img>
                </div>
              </div>
              <div className="field is-expanded">
                <button className="button is-light is-fullwidth">
                  Open larger
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
