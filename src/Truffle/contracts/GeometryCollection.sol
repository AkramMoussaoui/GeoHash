pragma solidity >=0.4.0 <0.7.2;

import "./Point.sol";


contract GeometryCollection {
    address public deployer;
    uint256 public nbrPoint = 0;
    Point[] public Points;
    event point(uint256 id, string geohash, address owner);

    constructor() public {
        deployer = msg.sender;
    }

    function setPoint(string memory _geohash) public {
        nbrPoint = nbrPoint + 1;
        Point currentPoint = new Point(nbrPoint, _geohash, msg.sender);
        Points.push(currentPoint);
        emit point(
            currentPoint.Id(),
            currentPoint.Geohash(),
            currentPoint.Owner()
        );
    }
}
