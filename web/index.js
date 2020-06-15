import React from "react";
import ReactDOM from "react-dom";
import ReactCrop from "react-image-crop";

import "bulma/css/bulma.css";
import "./styles.css";
import "react-image-crop/dist/ReactCrop.css";

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Image seam carving demo</h1>
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
              <p className="title">Select an image...</p>
              <p className="subtitle">Image editor will appear here.</p>
            </article>
          </div>
          <br />
          <div className="tile is-ancestor">
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">1. Image edge detection</p>
                <div className="is-flex is-horizontal-center">
                  <figure className="image is-128x128 ">
                    <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                  </figure>
                </div>
              </article>
            </div>
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">2. Optimal seam computation</p>
                <div className="is-flex is-horizontal-center">
                  <figure className="image is-128x128 ">
                    <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                  </figure>
                </div>
              </article>
            </div>
            <div className="tile is-parent has-text-centered">
              <article className="tile is-child box">
                <p className="subtitle">3. Seam carving</p>
                <div className="is-flex is-horizontal-center">
                  <figure className="image is-128x128 ">
                    <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                  </figure>
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
