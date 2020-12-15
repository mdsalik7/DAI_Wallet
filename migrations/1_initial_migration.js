const Migrations = artifacts.require("Migrations");
const DaiTokenMock = artifacts.require("DaiTokenMock");


module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(DaiTokenMock);
  const tokenMock = await DaiTokenMock.deployed()
  //Mint 1000 dai tokens for the deployer
  await tokenMock.mint('0x393fbBe31cA5AFe4f4292362C3DAbBea246F8347','1000000000000000000000')
};
