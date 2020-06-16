import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.css";
import "./styles.css";
import "react-image-crop/dist/ReactCrop.css";
import "regenerator-runtime/runtime";

import Header from "./components/Header";
import ImageSelector from "./components/ImageSelector";
import CroppedImagePreview from "./components/CroppedImagePreview";
import FullscreenImageModel from "./components/FullscreenImageModal";
import ImageResizeService from "./services/ImageResizeService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrop } from "@fortawesome/free-solid-svg-icons";

import "./services/ImageResizeService";

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageName: null,
      resizeResultImages: undefined,
      resized: undefined,
      resizing: undefined,
      imageResizeModel: null,
      crop: null,
      dimensions: null,
    };
    this.imageResizeService = new ImageResizeService();
  }

  resetState() {
    this.setState({
      imageName: null,
      resizeResultImages: undefined,
      resized: undefined,
      resizing: undefined,
      imageResizeModel: null,
      crop: null,
      dimensions: null,
    });
  }

  processSelectedImage() {
    const { imageResizeModel } = this.state;

    if (!imageResizeModel) return;

    this.setState({ resizing: true, resized: false });

    this.imageResizeService
      .resizeImage(imageResizeModel)
      .then((resultImages) => {
        console.log(resultImages);
        this.setState({
          resizeResultImages: resultImages,
          resizing: false,
          resized: true,
        });
      });
  }

  render() {
    const {
      resized,
      resizeResultImages,
      resizing,
      imageResizeModel,
      dimensions,
      crop,
      imageName,
    } = this.state;
    console.log(this.state);
    const processButton =
      !resizing && imageResizeModel ? (
        <button
          className="button is-primary"
          onClick={() => {
            this.processSelectedImage();
          }}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faCrop} />
          </span>
          &nbsp; Resize
        </button>
      ) : (
        <div></div>
      );

    const progressBar = resizing ? (
      <progress className="progress is-primary" max="100">
        40%
      </progress>
    ) : (
      <div></div>
    );

    const currentDimensions = dimensions ? (
      <span>
        Current dimensions : ({dimensions.width}, {dimensions.height})
      </span>
    ) : (
      <div></div>
    );

    const cropDimensions = crop ? (
      <span>
        New dimensions : ({crop.width}, {crop.height})
      </span>
    ) : (
      <div></div>
    );
    return (
      <div>
        <Header />
        <br />
        <div className="container">
          <div
            className="tile is-ancestor has-text-centered"
            style={{ margin: "0px auto" }}
          >
            <article className="tile is-child box">
              <div className="is-flex is-horizontal-center">
                <br />
                <form>
                  <div class="field is-grouped is-grouped-centered">
                    <p class="control">
                      <p className="control is-fullwidth">
                        {currentDimensions}
                      </p>
                      <p className="control is-fullwidth">{cropDimensions}</p>
                    </p>
                    <p class="control">
                      <p className="control is-fullwidth">{processButton} </p>
                    </p>
                  </div>
                  <div className="field">
                    <ImageSelector
                      croppedImageUrl={
                        resizeResultImages
                          ? resizeResultImages.cropped_url
                          : null
                      }
                      onImageSelected={() => {
                        this.resetState();
                      }}
                      onDimensionsSelected={({
                        model,
                        crop,
                        dimensions,
                        imageName,
                      }) => {
                        this.setState({
                          imageResizeModel: model,
                          crop,
                          dimensions,
                          imageName,
                        });
                      }}
                    />
                    <CroppedImagePreview
                      croppedImageUrl={
                        resizeResultImages
                          ? resizeResultImages.cropped_url
                          : null
                      }
                      croppedImageName={imageName}
                    />
                  </div>
                  <div className="field">
                    <div className="control">{progressBar}</div>
                  </div>
                </form>
              </div>
            </article>
          </div>
          <br />

          <div
            className="tile is-ancestor"
            style={{ display: !resized ? "none" : "flex" }}
          >
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">Computed energy</p>
                <div className="is-flex is-horizontal-center">
                  <div>
                    <div className="field is-fullwidth">
                      <figure className="image">
                        <img
                          src={
                            resizeResultImages
                              ? resizeResultImages.energy_url
                              : ""
                          }
                        ></img>
                      </figure>
                    </div>
                    <FullscreenImageModel
                      imageUrl={
                        resizeResultImages ? resizeResultImages.energy_url : ""
                      }
                    />
                  </div>
                </div>
              </article>
            </div>
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">Optimal seams based on energy</p>
                <div className="is-flex is-horizontal-center">
                  <div>
                    <div className="field is-fullwidth">
                      <figure className="image">
                        <img
                          src={
                            resizeResultImages
                              ? resizeResultImages.marked_energy_url
                              : ""
                          }
                        ></img>
                      </figure>
                    </div>
                    <FullscreenImageModel
                      imageUrl={
                        resizeResultImages
                          ? resizeResultImages.marked_energy_url
                          : ""
                      }
                    />
                  </div>
                </div>
              </article>
            </div>
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">
                  Optimal seams drawn on original image
                </p>
                <div className="is-flex is-horizontal-center">
                  <div>
                    <div className="field is-fullwidth">
                      <figure className="image">
                        <img
                          src={
                            resizeResultImages
                              ? resizeResultImages.original_marked_url
                              : ""
                          }
                        ></img>
                      </figure>
                    </div>
                    <FullscreenImageModel
                      imageUrl={
                        resizeResultImages
                          ? resizeResultImages.original_marked_url
                          : ""
                      }
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const App = document.getElementById("app");

ReactDOM.render(<AppComponent name="App" />, App);
