import { DeployFunction } from "hardhat-deploy/dist/types";
import { devlopmentChains, networkConfig } from "../config";
import { ethers, network } from "hardhat";
import { TypedContractMethod } from "../typechain-types/common";

const main: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    // getChainId,
    // getUnnamedAccounts,
  })=>{
    
   
    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = deployments
    log("deploying NFTPoolLockAndRelease contarct")

    let sourcechainRouter;
    let linkTokenAddress;
    if(devlopmentChains.includes(network.name)){

      const CCIPLocalSimulatorDeployments = await deployments.get("CCIPLocalSimulator");
      const ccipLocalSimulator = ethers.getContractAt("CCIPLocalSimulator",CCIPLocalSimulatorDeployments.address)
      const ccipConfigFunction  = (await ccipLocalSimulator).getFunction("configuration");
      const ccipConfig = await ccipConfigFunction();
      sourcechainRouter = ccipConfig.sourceRouter_;
      linkTokenAddress = ccipConfig.linkToken_;
      
    } else {
      const chainId = network.config.chainId;
      sourcechainRouter = networkConfig[chainId as number].router
      linkTokenAddress = networkConfig[chainId as number].link
    }

    const nftDeployments = await deployments.get("MyToken");
    const nftAddress = nftDeployments.address;

    // address _router, address _link,address nftAddress
    await deploy("NFTPoolLockAndRelease",{
      contract: "NFTPoolLockAndRelease",
      from: firstAccount,
      args: [sourcechainRouter,linkTokenAddress,nftAddress],
      log: true
    });


    log(" NFTPoolLockAndRelease contarct deployed successfully!")

      
    
}
export default main;
main.tags = ["sourcechain","all"];