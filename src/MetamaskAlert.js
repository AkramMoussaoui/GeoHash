import React, { Component } from "react";
import metamask from "./metamask.png";
import styled from "styled-components";

const Styles = styled.div`
  text-align: center;
`;
class MetamaskAlert extends Component {
  render() {
    return (
      <Styles>
        <a href="https://metamask.io/download.html">
          <img src={metamask} width="250" alt="" />
          <h1>Please Install Metamask</h1>
        </a>
      </Styles>
    );
  }
}

export default MetamaskAlert;
