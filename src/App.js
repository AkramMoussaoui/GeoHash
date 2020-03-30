import React, { Component } from "react";
import { Map, TileLayer, Popup, Marker } from "react-leaflet";
import styled from "styled-components";
import { useTable } from "react-table";
import Web3 from "web3";
import geo from "./Truffle/build/contracts/GeometryCollection.json";
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
      events: [
        {
          id: "0",
          geohash: "akram",
          owner: "0xE4D88C03E61f8Cf2b6aBC1Ae907C5c7C82428472"
        }
      ],
      currentPos: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentWillMount() {
    // Detect Metamask
    const metamaskInstalled = typeof window.web3 !== "undefined";
    this.setState({ metamaskInstalled });
    if (metamaskInstalled) {
      await this.loadWeb3();
      await this.loadBlockchainData();
    }
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
    return (
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
                <button>ADD</button>
              </Popup>
            </MyMarker>
          )}
        </Map>
        <Styles>
          <Table columns={columns} data={this.state.events} />
        </Styles>
      </div>
    );
  }
}

export default MapExample;
