require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { task } = require("hardhat/config");
const {
  API_URL_ARBITRIUM_GOERLI,
  API_URL_MUMBAI,
  API_URL_AVALANCHE_CCHAAIN,
  API_URL_AURORA,
  API_URL_OPBNB,
  PRIVATE_KEY,
} = process.env;

task(
  "account",
  "returns nonce and balance for specified address on multiple networks"
)
  .addParam("address")
  .setAction(async (taskArgs) => {
    const web3ArbGoerli = createAlchemyWeb3(API_URL_ARBITRIUM_GOERLI);
    const web3Mumbai = createAlchemyWeb3(API_URL_MUMBAI);
    const web3Ava = createAlchemyWeb3(API_URL_AVALANCHE_CCHAAIN);
    const web3Aur = createAlchemyWeb3(API_URL_AURORA);
    const web3OPBNB = createAlchemyWeb3(API_URL_OPBNB);

    const networkIDArr = [
      "Arbitrum Goerli:",
      "Polygon Mumbai:",
      "Avalanche Fuji:",
      "Aurora:",
      "OP BNB :",
    ];
    const providerArr = [
      web3ArbGoerli,
      web3Mumbai,
      web3Ava,
      web3Aur,
      web3OPBNB,
    ];
    const resultArr = [];

    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(
        taskArgs.address,
        "latest"
      );
      const balance = await providerArr[i].eth.getBalance(taskArgs.address);
      resultArr.push([
        networkIDArr[i],
        nonce,
        parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2) +
          "ETH",
      ]);
    }
    resultArr.unshift(["  |NETWORK|   |NONCE|   |BALANCE|  "]);
    console.log(resultArr);
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {},
    goerli: {
      url: API_URL_ARBITRIUM_GOERLI,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mumbai: {
      url: API_URL_MUMBAI,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    avalanche: {
      url: API_URL_AVALANCHE_CCHAAIN,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    aurora: {
      url: API_URL_AURORA,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    opbnb: {
      url: API_URL_OPBNB,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};
