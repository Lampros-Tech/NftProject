require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
  matic: {
    url: 'https://polygon-mumbai.g.alchemy.com/v2/icIDw4cHk2lFJUI1oiXKWO_-uYDno3uq',
    accounts: ['31557b9f24da29f196bd609b44d84033fc3f3787020f4ee148a72e79d1ae64f8'],
  }
}
};
