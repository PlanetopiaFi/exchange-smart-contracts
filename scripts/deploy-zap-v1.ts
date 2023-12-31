import { ethers, network, run } from "hardhat";
import config from "../config";

const main = async () => {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");

  const networkName = network.name;

  // Sanity checks
  if (networkName === "mainnet") {
    if (!process.env.KEY_MAINNET) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  } else if (networkName === "testnet") {
    if (!process.env.KEY_TESTNET) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  }

  if (!config.PlanetopiaRouter[networkName] || config.PlanetopiaRouter[networkName] === ethers.constants.AddressZero) {
    throw new Error("Missing router address, refer to README 'Deployment' section");
  }

  if (!config.WFON[networkName] || config.WFON[networkName] === ethers.constants.AddressZero) {
    throw new Error("Missing WFON address, refer to README 'Deployment' section");
  }

  console.log("Deploying to network:", networkName);

  // Deploy PlanetopiaZapV1
  console.log("Deploying PlanetopiaZap V1..");

  const PlanetopiaZapV1 = await ethers.getContractFactory("PlanetopiaZapV1");

  const planetopiaZap = await PlanetopiaZapV1.deploy(
    config.WFON[networkName],
    config.PlanetopiaRouter[networkName],
    config.MaxZapReverseRatio[networkName]
  );

  await planetopiaZap.deployed();

  console.log("PlanetopiaZap V1 deployed to:", planetopiaZap.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
