import { ethers } from "ethers";
import { getAccountPhrase, getWallet } from "@rly-network/mobile-sdk";
import EnsRegsitar from "../constants/EnsRegsitar.json";
import { Alert } from "react-native";
import * as Crypto from "expo-crypto";

import {
  VerbalAddress,
  SessionsAddress,
  PodcastAddress,
  RewardsAddress,
  VerbalABI,
  SessionsABI,
  PodcastABI,
  RewardsABI,
} from "../constants/contract";

// Convert wei value to ether
const etherValue = (weiValue) => ethers.utils.formatEther(weiValue);

// Convert number to wei value
const weiValue = (number) => ethers.utils.parseUnits(String(number), "wei");

// export const durationToRegister = 31556952; // 1 year
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

export const register = async (name, owner, durationToRegister) => {
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

export const fetchUserVerbalTokenBalance = async (userAddress) => {
  try {
    const contract = await connectWithContract(VerbalAddress, VerbalABI);
    const userTokenBalance = await contract?.balanceOf(userAddress);
    console.log("USER BALANCE IS ___", userTokenBalance);
    return userTokenBalance;
  } catch (error) {
    console.log(error.message);
  }
};

export const registerAsMentor = async (mentorPrice) => {
  //note that this function takes the caller as the person registering his mentor price
  try {
    const contract = await connectWithContract(SessionsAddress, SessionsABI);
    await contract?.registerMentorPrice(weiValue(mentorPrice));
  } catch (error) {
    console.log(error.message);
  }
};

export const scheduleASession = async (
  mentorAddress,
  timestamp,
  meetingLink,
  mentorPrice
) => {
  //note that this functionn schedules a session, timestamp:int, mentorPrice: int, meetingLink: string(IPFS HASH), address of the mentor
  try {
    const contract = await connectWithContract(SessionsAddress, SessionsABI);
    await contract?.scheduleASession(mentorAddress, timestamp, meetingLink, {
      value: weiValue(mentorPrice),
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getSessionIds = async (address) => {
  //note that this fucntion gets all session ids tied to the account, should return an array
  try {
    const contract = await connectWithContract(SessionsAddress, SessionsABI);
    const sessionIds = await contract?.getUserSessions(address);
    return sessionIds;
  } catch (error) {
    console.log(error.message);
  }
};

export const getSessionDetails = async (sessionId) => {
  //note that this fucntion gets info about the sesion, returns an object
  try {
    const contract = await connectWithContract(SessionsAddress, SessionsABI);
    const sessionDetails = await contract?.getSessionDetails(sessionId);
    return sessionDetails;
  } catch (error) {
    console.log(error.message);
  }
};

export const cancelSession = async (sessionId) => {
  //note that this fucntion cancels a session, takes msg.sender as caller
  try {
    const contract = await connectWithContract(SessionsAddress, SessionsABI);
    await contract?.cancelSession(sessionId);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

export const acceptSession = async (sessionId) => {
  //note that this fucntion accepts a session, takes msg.sender as caller
  try {
    const contract = await connectWithContract(SessionsAddress, SessionsABI);
    await contract?.acceptSession(sessionId);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

//PODCASTSSSS

export const uploadAPodcast = async (ipfsHash, podcastPrice) => {
  //note that this fucntion uploads a podcast takes the IPFS HASH (string)and the podcast price, takes msg.sender as caller
  try {
    const contract = await connectWithContract(PodcastAddress, PodcastABI);
    await contract?.uploadPodcast(ipfsHash, weiValue(podcastPrice));
    return true; //returns true for successful upload
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserPodcastsId = async (address) => {
  //note that this fucntion gets all podcast tied to an account, return array
  try {
    const contract = await connectWithContract(PodcastAddress, PodcastABI);
    const podcastIds = await contract?.getUserPodcasts(address);
    return podcastIds;
  } catch (error) {
    console.log(error.message);
  }
};

export const getPodcastDetails = async (podcastId) => {
  //note that this fucntion gets info about the  podcast, returns an object
  try {
    const contract = await connectWithContract(PodcastAddress, PodcastABI);
    const podcastDetails = await contract?.getPodcastInfo(podcastId);
    return podcastDetails;
  } catch (error) {
    console.log(error.message);
  }
};

export const supportAPodcast = async (podcastId, supportAmount) => {
  //note that this fucntion allows supporting a podcast takes id and amount needed
  try {
    const contract = await connectWithContract(PodcastAddress, PodcastABI);
    await contract?.supportPodcast(podcastId, {
      value: weiValue(supportAmount),
    });
    return true; //returns true for successful support
  } catch (error) {
    console.log(error.message);
  }
};

//REWARDSSSSSSS
export const checkAndReward = async (address) => {
  //note that this fucntion checks an address worthy of rewards and rewards it where neccessary
  try {
    const contract = await connectWithContract(RewardsAddress, RewardsABI);
    await contract?.checkAndReward(address);
    return true; //returns true for success
  } catch (error) {
    console.log(error.message);
  }
};
// Other Reward function for returning values to track users total rewards

export const getPodcastRewardsCount = async (address) => {
  try {
    const contract = await connectWithContract(RewardsAddress, RewardsABI);
    const count = await contract?.getCountOfUploadPodcastRewards(address);
    return count;
  } catch (error) {
    console.log(error.message);
  }
};
export const getSupportRewardsCount = async (address) => {
  try {
    const contract = await connectWithContract(RewardsAddress, RewardsABI);
    const count = await contract?.getCountOfSupportRewards(address);
    return count;
  } catch (error) {
    console.log(error.message);
  }
};
export const getAttendanceRewardsCount = async (address) => {
  try {
    const contract = await connectWithContract(RewardsAddress, RewardsABI);
    const count = await contract?.getCountOfAttendanceRewards(address);
    return count;
  } catch (error) {
    console.log(error.message);
  }
};
export const getMentoringRewardsCount = async (address) => {
  try {
    const contract = await connectWithContract(RewardsAddress, RewardsABI);
    const count = await contract?.getCountOfMentoringRewards(address);
    return count;
  } catch (error) {
    console.log(error.message);
  }
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
