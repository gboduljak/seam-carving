import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.css";
import "./styles.css";
import "react-image-crop/dist/ReactCrop.css";
import "regenerator-runtime/runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import ImageSelector from "./components/ImageSelector";
import CroppedImagePreview from "./components/CroppedImagePreview";

import axios from "axios";
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageName: null,
      processedImages: undefined,
      processed: undefined,
      processing: undefined,
      processingRequest: null,
      crop: null,
      dimensions: null,
    };
  }

  processSelectedImage() {
    const { processingRequest } = this.state;

    if (!processingRequest) return;

    this.setState({ processing: true, processed: false });
    axios
      .post("http://localhost:5000/resize", processingRequest)
      .then((response) => {
        const [
          original_url,
          cropped_url,
          original_marked_url,
          energy_url,
          marked_energy_url,
        ] = response.data.processed_images;

        this.setState({
          processedImages: {
            original_url,
            cropped_url,
            original_marked_url,
            energy_url,
            marked_energy_url,
          },
        });
        this.setState({ processing: false, processed: true });
      });
  }

  render() {
    const {
      processed,
      processedImages,
      processing,
      processingRequest,
      dimensions,
      crop,
      imageName,
    } = this.state;
    console.log(this.state);
    const processButton =
      !processing && processingRequest ? (
        <button
          className="button is-primary"
          onClick={() => {
            this.processSelectedImage();
          }}
        >
          Resize
        </button>
      ) : (
        <div></div>
      );

    const progressBar = processing ? (
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
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                <FontAwesomeIcon icon={faImage} />
                &nbsp; Image seam carving
              </h1>
              <h2 className="subtitle">Context aware image resizing app</h2>
            </div>
          </div>
        </section>
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
                        processedImages ? processedImages.cropped_url : null
                      }
                      onDimensionsSelected={({
                        model,
                        crop,
                        dimensions,
                        imageName,
                      }) => {
                        this.setState({
                          processingRequest: model,
                          crop,
                          dimensions,
                          imageName,
                        });
                      }}
                    />
                    <CroppedImagePreview
                      croppedImageUrl={
                        processedImages ? processedImages.cropped_url : null
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
            style={{ display: !processed ? "none" : "flex" }}
          >
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">Computed energy</p>
                <div className="is-flex is-horizontal-center">
                  <form>
                    <div className="field is-fullwidth">
                      <figure className="image">
                        <img
                          src={
                            processedImages ? processedImages.energy_url : ""
                          }
                        ></img>
                      </figure>
                    </div>
                    <div className="field is-expanded">
                      <button class="button is-light is-fullwidth">
                        Open larger
                      </button>
                    </div>
                  </form>
                </div>
              </article>
            </div>
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">Optimal seams based on energy</p>
                <div className="is-flex is-horizontal-center">
                  <form>
                    <div className="field is-fullwidth">
                      <figure className="image">
                        <img
                          src={
                            processedImages
                              ? processedImages.marked_energy_url
                              : ""
                          }
                        ></img>
                      </figure>
                    </div>
                    <div className="field is-expanded">
                      <button class="button is-light is-fullwidth">
                        Open larger
                      </button>
                    </div>
                  </form>
                </div>
              </article>
            </div>
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">
                  Optimal seams drawn on original image
                </p>
                <div className="is-flex is-horizontal-center">
                  <form>
                    <div className="field is-fullwidth">
                      <figure className="image">
                        <img
                          src={
                            processedImages
                              ? processedImages.original_marked_url
                              : ""
                          }
                        ></img>
                      </figure>
                    </div>
                    <div className="field is-expanded">
                      <button class="button is-light is-fullwidth">
                        Open larger
                      </button>
                    </div>
                  </form>
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
