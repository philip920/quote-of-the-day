/* eslint-disable no-undef */
const Quote = artifacts.require("Quote");

module.exports = function(deployer) {
  deployer.deploy(Quote);
};
