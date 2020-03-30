import React, { Component } from "react";
import metamask from "./metamask.png";

class MetamaskAlert extends Component {
  render() {
    return (
      <div className="my-5 text-center">
        <img src={metamask} width="250" class="mb-4" alt="" />
        <h1>Please Install Metamask</h1>
      </div>
    );
  }
}

export default MetamaskAlert;
