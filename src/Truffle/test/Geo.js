const Geo = artifacts.require("GeometryCollection");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Geo", accounts => {
  let geo;

  before(async () => {
    geo = await Geo.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await geo.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("its initialized ", async () => {
      const nbrPoint = await geo.nbrPoint();
      const deployeur = await geo.deployeur();
      assert.equal(nbrPoint, 0);
      assert.equal(deployeur, accounts[0]);
    });
  });

  describe("set point", async () => {
    let result, nbrPoint;

    before(async () => {
      result = await geo.setPoint("akram", { from: accounts[1] });
      nbrPoint = await geo.nbrPoint();
    });

    it("create point", async () => {
      const event = result.logs[0].args;
      assert.equal(nbrPoint, 1, "nbrPoint is correct");
      assert.equal(event.id.toNumber(), nbrPoint.toNumber(), "id is correct");
      assert.equal(event.geohash, "akram", "geohash is correct");
      assert.equal(event.owner, accounts[1], "owner is correct");
    });
  });
});
