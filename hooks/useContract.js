import { ethers } from "ethers";
import { getAccountPhrase, getWallet } from "@rly-network/mobile-sdk";
import EnsRegsitar from "../constants/EnsRegsitar.json";
import { Alert } from "react-native";
import * as Crypto from "expo-crypto";

export const durationToRegister = 31556952; // 1 year
export const resolver = "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750";
export const ABI = [
  "function rentPrice(string memory name, uint duration) view public returns(uint)",
  "function available(string memory name) public view returns(bool)",
  "function makeCommitmentWithConfig(string memory name, address owner, bytes32 secret, address resolver, address addr) pure public returns(bytes32)",
  "function commit(bytes32 commitment) public",
  "function registerWithConfig(string memory name, address owner, uint duration, bytes32 secret, address resolver, address addr) public payable",
  "function minCommitmentAge() public view returns(uint)",
];

export const connectWithContract = async (contractAddress, contractAbi) => {
  // const wallet = await getWallet();
  // console.log("wallet", wallet);
  // // const provider = ethers.providers.JsonRpcProvider(rpcUrl);
  // const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
  // return contract;
  const mnemonic = await getAccountPhrase();
  const privateKey =
    ethers.Wallet.fromMnemonic(mnemonic)._signingKey().privateKey;
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/eth_goerli",
    "goerli"
  );

  const wallet = new ethers.Wallet(privateKey, provider);

  const myContract = new ethers.Contract(contractAddress, contractAbi, wallet);
  return myContract;
};

export const register = async (name, owner) => {
  try {
    const contract = await connectWithContract(
      "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5",
      ABI
    );
    const isNameAvailable = await contract?.available(name);
    if (!isNameAvailable) {
      return Alert.alert(`${name}.eth is not available`);
    }

    const randomBytes = Crypto.getRandomBytes(32);
    const secretHex =
      "0x" +
      randomBytes.reduce(
        (acc, byte) => acc + byte.toString(16).padStart(2, "0"),
        ""
      );
    console.log(`your secret is: ${secretHex}`);

    //make a commitment
    const commitment = await contract?.makeCommitmentWithConfig(
      name,
      owner,
      randomBytes,
      resolver,
      owner
    );
    const commit = await contract?.commit(commitment);
    console.log(
      `Commitment pending: https://goerli.etherscan.io/tx/${commit.hash}`
    );
    await commit.wait();

    //wait for commitment to be confirmed
    const minCommmitmentAge = Number(await contract?.minCommitmentAge());
    console.log(
      `Commitment successful, waiting ${minCommmitmentAge} seconds....`
    );

    //Get the price per name

    const priceWei = Number(
      await contract?.rentPrice(name, durationToRegister)
    );

    const priceInEth = priceWei / Number(ethers.constants.WeiPerEther);

    //Register a name
    const register = await contract?.registerWithConfig(
      name,
      owner,
      durationToRegister,
      randomBytes,
      resolver,
      owner,
      {
        value: priceWei,
      }
    );
    console.log(
      `submitting transaction - https://goerli.etherscan.io/tx/${register.hash}`
    );
    await register.wait();
    console.log(`
    ${name}.eth registered succesfully for ${priceInEth.toFixed(
      4
    )} Eth (not including gas)`);
  } catch (error) {
    console.log(error.message);
  }
  // const wallet = await getWallet()
  // console.log("wallet", wallet);
};

// export function addAvalancheNetwork() {
//   injected.getProvider().then((provider) => {
//     provider
//       .request({
//         method: "wallet_addEthereumChain",
//         params: [AVALANCHE_MAINNET_PARAMS],
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   });
// }
