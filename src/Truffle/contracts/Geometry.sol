pragma solidity >=0.4.0 <0.7.2;


contract Geometry {
    uint256 public Id;
    string public Geohash;
    address public Owner;

    function geometryType(string memory _type)
        public
        pure
        returns (string memory)
    {
        return _type;
    }

    function isMeasurable(bool _is) public pure returns (bool) {
        return _is;
    }
}
