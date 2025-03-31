import { DeployFunction } from "hardhat-deploy/dist/types";
import { devlopmentChains } from "../config";
import { ethers, network } from "hardhat";
import { TypedContractMethod } from "../typechain-types/common";

const main: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    // getChainId,
    // getUnnamedAccounts,
  })=>{
    
    if(devlopmentChains.includes(network.name)){
      const {firstAccount} = await getNamedAccounts()
      const {deploy,log} = deployments

      log("deploying NFTPoolLockAndRelease contarct")

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
            (await ccipLocalSimulator).getFunction("configuration")
      */

      const CCIPLocalSimulatorDeployments = await deployments.get("CCIPLocalSimulator");
      const ccipLocalSimulator = ethers.getContractAt("CCIPLocalSimulator",CCIPLocalSimulatorDeployments.address)
      const ccipConfigFunction  = (await ccipLocalSimulator).getFunction("configuration");
      const ccipConfig = await ccipConfigFunction();
      const sourceRouter_ = ccipConfig.sourceRouter_;
      const linkToken_ = ccipConfig.linkToken_;
      const nftDeployments = await deployments.get("MyToken");
      const nftAddress = nftDeployments.address;

      // address _router, address _link,address nftAddress
      await deploy("NFTPoolLockAndRelease",{
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        args: [sourceRouter_,linkToken_,nftAddress],
        log: true
      });


      log(" NFTPoolLockAndRelease contarct deployed successfully!")

      
    } else {
      console.log("env is not local,mock contarct is skipped!");
    }
}
export default main;
main.tags = ["sourcechain","all"];