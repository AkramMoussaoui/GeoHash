import React, { Component } from "react";
import { Map, TileLayer, Popup, Marker } from "react-leaflet";
import styled from "styled-components";
import { useTable } from "react-table";
import Web3 from "web3";
import GeometryCollection from "./Truffle/build/contracts/GeometryCollection.json";
import { geoToH3 } from "h3-js";
import MetamaskAlert from "./MetamaskAlert";
const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const MyMarker = props => {
  const initMarker = ref => {
    if (ref) {
      ref.leafletElement.openPopup();
    }
  };

  return <Marker ref={initMarker} {...props} />;
};

class MapExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      currentPos: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.setPoint = this.setPoint.bind(this);
  }

  async componentWillMount() {
    // Detect Metamask
    const metamaskInstalled = typeof window.web3 !== "undefined";
    this.setState({ metamaskInstalled });
    if (metamaskInstalled) {
      await this.loadWeb3();
      await this.loadBlockData();
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // DO NOTHING...
    }
  }

  async loadBlockData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const geo = new web3.eth.Contract(
      GeometryCollection.abi,
      "0xAC4AB72676D8861584DfBa02033F7586cB6edd5E"
    );
    this.setState({ geo });
    const pointNumber = await geo.methods.nbrPoint().call();
    this.setState({ pointNumber });
    this.setState({
      loading: false
    });
    geo.events.point(
      {
        fromBlock: 0,
        toBlock: "latest"
      },
      (error, result) => {
        let ob = {
          id: result.returnValues.id,
          geohash: result.returnValues.geohash,
          owner: result.returnValues.owner
        };
        this.setState(
          {
            events: [...this.state.events, ob]
          },
          () => {
            this.forceUpdate();
          }
        );
      }
    );
  }

  async setPoint() {
    await this.state.geo.methods
      .setPoint(
        geoToH3(this.state.currentPos.lat, this.state.currentPos.lng, 10)
      )
      .send({ from: this.state.account })
      .once("receipt", async receipt => {
        const pointNumber = await this.state.geo.methods.nbrPoint().call();
        this.setState({
          pointNumber
        });
        this.setState({ loading: false });
      });
  }

  handleClick(e) {
    this.setState({ currentPos: e.latlng });
  }

  render() {
    const columns = [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "GEOHASH",
        accessor: "geohash"
      },
      {
        Header: "OWNER",
        accessor: "owner"
      }
    ];
    let content;
    content = (
      <div>
        <Map
          center={this.props.center}
          zoom={this.props.zoom}
          onClick={this.handleClick}
        >
          <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          {this.state.currentPos && (
            <MyMarker position={this.state.currentPos}>
              <Popup position={this.state.currentPos}>
                Location:{" "}
                <pre>{JSON.stringify(this.state.currentPos, null, 2)}</pre>
                <button onClick={this.setPoint}>ADD</button>
              </Popup>
            </MyMarker>
          )}
        </Map>
        <Styles>
          <Table columns={columns} data={this.state.events} />
        </Styles>
      </div>
    );
    return (
      <main>{this.state.metamaskInstalled ? content : <MetamaskAlert />}</main>
    );
  }
}

export default MapExample;
