const Geo = artifacts.require("GeometryCollection");

module.exports = function(deployer) {
  deployer.deploy(Geo);
};
