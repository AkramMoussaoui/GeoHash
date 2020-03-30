import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MapExample from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <MapExample
      zoom={12}
      center={{ lat: 36.76549819221185, lng: 2.966394424438477 }}
    />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
