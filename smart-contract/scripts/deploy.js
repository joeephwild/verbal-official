const hre = require("hardhat");

async function main() {
  const podcastContract = await hre.ethers.deployContract("PodcastContract");
  const session = await hre.ethers.deployContract("Sessions");
  const verbalToken = await hre.ethers.deployContract("VerbalToken");

  await podcastContract.waitForDeployment();
  await session.waitForDeployment();

  console.log(`podcastContract deployed to ${podcastContract.target}`);
  console.log(`SessionContract deployed to ${session.target}`);
  console.log(`verbalTokent deployed to ${verbalToken.target}`);

  // const verbalTokenInstance = "0xbe9a1bD1FA89EbdE4A2381EFd708717c6e011a7C";

  const rewardsContract = await hre.ethers.deployContract("RewardsContract", [
    podcastContract.target,
    session.target,
    verbalToken.target,
  ]);

  // Wait for 5 seconds before calling the init function
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await verbalToken.initFunction(rewardsContract.target);

  console.log(`RewardsContract deployed to ${rewardsContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
