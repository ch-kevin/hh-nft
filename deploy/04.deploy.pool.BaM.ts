import { DeployFunction } from "hardhat-deploy/dist/types";
import { devlopmentChains, networkConfig } from "../config";
import { ethers, network } from "hardhat";

const main: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    // getChainId,
    // getUnnamedAccounts,
  })=>{

    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = deployments

    let destchainRouter;
    let linkTokenAddress;
    if(devlopmentChains.includes(network.name)){

      log("deploying NFTPoolBurnAndMint contarct")

      const CCIPLocalSimulatorDeployments = await deployments.get("CCIPLocalSimulator");
      const ccipLocalSimulator = await ethers.getContractAt("CCIPLocalSimulator",CCIPLocalSimulatorDeployments.address)
      const ccipConfig = await ccipLocalSimulator.configuration()
      destchainRouter = ccipConfig.destinationRouter_;
      linkTokenAddress = ccipConfig.linkToken_;

    } else {
      const chainId = network.config.chainId;
      destchainRouter = networkConfig[chainId as number].router
      linkTokenAddress = networkConfig[chainId as number].link
    }

    const wnftDeployments = await deployments.get("WrappedMyToken");
    const wnftAddress = wnftDeployments.address;

    // address _router, address _link,address nftAddress
    await deploy("NFTPoolBurnAndMint",{
      contract: "NFTPoolBurnAndMint",
      from: firstAccount,
      args: [destchainRouter,linkTokenAddress,wnftAddress],
      log: true
    });
    log(" NFTPoolBurnAndMint contarct deployed successfully!")
}
export default main;
main.tags = ["destchain","all"];