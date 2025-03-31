import { DeployFunction } from "hardhat-deploy/dist/types";
import { devlopmentChains } from "../config";
import { network } from "hardhat";

const main: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    // getChainId,
    // getUnnamedAccounts,
  })=>{
    
    if(devlopmentChains.includes(network.name)){
      const {firstAccount} = await getNamedAccounts()
      const {deploy,log} = deployments

      log("deploying nft contarct")
      await deploy("MyToken",{
        contract: "MyToken",
        from: firstAccount,
        args: ["myToken","MTT"],
        log: true
      });
      log(" NFT contarct deployed successfully!")
    } else {
      console.log("env is not local,mock contarct is skipped!");
    }
}
export default main;
main.tags = ["sourcechain","all"];