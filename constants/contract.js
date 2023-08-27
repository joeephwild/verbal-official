import verbalAbi from "./VerbalToken.json";
import sessionsAbi from "./Sessions.json";
import podcastAbi from "./PodcastContract.json";
import rewardsAbi from "./RewardsContract.json";

const VerbalAddress = "0x4100A82F582A09B44A0d2D8A0081B0aF396D2A12";
const PodcastAddress = "0x190C99181DEdd05894a19e1293831a3F992B75a8";
const SessionsAddress = "0xe969cC2488238D2408b6E1d92cece37a33E077CC";
const RewardsAddress = "0x73e5a7A236FF9CB73558433b6Da2880630511629";

const VerbalABI = verbalAbi.abi;
const SessionsABI = sessionsAbi.abi;
const PodcastABI = podcastAbi.abi;
const RewardsABI = rewardsAbi.abi;
export {
  VerbalAddress,
  VerbalABI,
  PodcastAddress,
  PodcastABI,
  SessionsAddress,
  SessionsABI,
  RewardsAddress,
  RewardsABI,
};
