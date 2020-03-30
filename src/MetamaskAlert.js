import React, { Component } from "react";
import metamask from "./metamask.png";

class MetamaskAlert extends Component {
  render() {
    return (
      <div>
        <img src={metamask} width="250" alt="" />
        <h1>Please Install Metamask</h1>
      </div>
    );
  }
}

export default MetamaskAlert;
