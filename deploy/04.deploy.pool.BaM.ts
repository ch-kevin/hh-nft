import { DeployFunction } from "hardhat-deploy/dist/types";
import { devlopmentChains } from "../config";
import { ethers, network } from "hardhat";

const main: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    // getChainId,
    // getUnnamedAccounts,
  })=>{
    
    if(devlopmentChains.includes(network.name)){
      const {firstAccount} = await getNamedAccounts()
      const {deploy,log} = deployments

      log("deploying NFTPoolBurnAndMint contarct")

      /*
        returns (
            uint64 chainSelector_,
            IRouterClient sourceRouter_,
            IRouterClient destinationRouter_,
            WETH9 wrappedNative_,
            LinkToken linkToken_,
            BurnMintERC677Helper ccipBnM_,
            BurnMintERC677Helper ccipLnM_
        )
      */

      const CCIPLocalSimulatorDeployments = await deployments.get("CCIPLocalSimulator");
      const ccipLocalSimulator = ethers.getContractAt("CCIPLocalSimulator",CCIPLocalSimulatorDeployments.address)
      const ccipConfigFunction  = (await ccipLocalSimulator).getFunction("configuration");
      const ccipConfig = await ccipConfigFunction();
      const destRouter_ = ccipConfig.destinationRouter_;
      const linkToken_ = ccipConfig.linkToken_;
      const wnftDeployments = await deployments.get("WrappedMyToken");
      const wnftAddress = wnftDeployments.address;

      // address _router, address _link,address nftAddress
      await deploy("NFTPoolBurnAndMint",{
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        args: [destRouter_,linkToken_,wnftAddress],
        log: true
      });
      log(" NFTPoolBurnAndMint contarct deployed successfully!")

      
    } else {
      console.log("env is not local,mock contarct is skipped!");
    }
}
export default main;
main.tags = ["destchain","all"];