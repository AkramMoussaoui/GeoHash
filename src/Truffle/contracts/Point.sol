pragma solidity >=0.4.0 <0.7.2;

import "./Geometry.sol";


contract Point is Geometry {
    constructor(uint256 _id, string memory _geohash, address _owner) public {
        Id = _id;
        Geohash = _geohash;
        Owner = _owner;
    }

    function geometryType() public pure returns (string memory) {
        return Geometry.geometryType("Point");
    }

    function isMeasurable() public pure returns (bool) {
        return Geometry.isMeasurable(false);
    }
}
